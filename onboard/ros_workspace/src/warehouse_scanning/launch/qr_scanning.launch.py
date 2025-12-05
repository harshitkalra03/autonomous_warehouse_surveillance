from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import ExecuteProcess

def generate_launch_description():
    return LaunchDescription([
        # Launch the image viewer node (YOLO + QR detection)
        Node(
            package='warehouse_scanning',
            executable='qr_detection',
            name='qr_detection',
            output='screen',
            parameters=[
                {'device': 'cpu'}  # Change to 'cuda' if GPU available
            ],
            emulate_tty=True
        ),
        

    ])