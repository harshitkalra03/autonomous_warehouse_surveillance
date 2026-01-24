from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([

        Node(
            package='joy',
            executable='joy_node',
            name='joy_node',
            parameters=[{
                'dev': '/dev/input/js0',
                'deadzone': 0.0,
                'autorepeat_rate': 20.0,
            }]
        ),

        Node(
            package='warehouse_navigation',
            executable='controller_node.py',
            name='controller_node',
            output='screen'
        ),
    ])

