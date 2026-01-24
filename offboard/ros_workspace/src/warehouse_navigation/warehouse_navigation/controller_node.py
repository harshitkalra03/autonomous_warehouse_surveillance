#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Joy
from geometry_msgs.msg import Twist
from std_msgs.msg import String  # For motor commands

class JoyCurvedTeleop(Node):
    def __init__(self):
        super().__init__('joy_curved_teleop')

        # Publishers
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.stepper_publisher = self.create_publisher(String, '/motor_command', 10)

        # Subscription
        self.sub = self.create_subscription(Joy, '/joy', self.joy_cb, 10)

        # ---- Controller mapping (Xbox-style) ----
        self.DPAD_X_AXIS = 6   # left/right
        self.DPAD_Y_AXIS = 7   # up/down

        self.A_BUTTON = 0
        self.B_BUTTON = 1
        self.X_BUTTON = 2
        self.Y_BUTTON = 3

        # ---- Speeds ----
        self.linear_speed = 1.0
        self.turn_speed = 1.5

    def joy_cb(self, msg):
        twist = Twist()

        # -------------------------------
        # Curved turning with buttons
        # -------------------------------
        if msg.buttons[self.B_BUTTON]:
            twist.linear.x = self.linear_speed
            twist.angular.z = -self.turn_speed

        elif msg.buttons[self.X_BUTTON]:
            twist.linear.x = self.linear_speed
            twist.angular.z = self.turn_speed

        # -------------------------------
        # D-pad linear control
        # -------------------------------
        else:
            # Forward / backward
            if msg.axes[self.DPAD_Y_AXIS] != 0.0:
                twist.linear.x = self.linear_speed * msg.axes[self.DPAD_Y_AXIS]

            # Strafe left / right
            if msg.axes[self.DPAD_X_AXIS] != 0.0:
                twist.linear.y = self.linear_speed * msg.axes[self.DPAD_X_AXIS]

        # Publish cmd_vel
        self.cmd_pub.publish(twist)

        # -------------------------------
        # Motor commands
        # -------------------------------
        if msg.buttons[self.Y_BUTTON]:
            motor_msg = String()
            motor_msg.data = 'p 35'
            self.stepper_publisher.publish(motor_msg)
            self.get_logger().info(f'Published: "{motor_msg.data}"')

        if msg.buttons[self.A_BUTTON]:
            motor_msg = String()
            motor_msg.data = 'n 35'
            self.stepper_publisher.publish(motor_msg)
            self.get_logger().info(f'Published: "{motor_msg.data}"')


def main():
    rclpy.init()
    node = JoyCurvedTeleop()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
