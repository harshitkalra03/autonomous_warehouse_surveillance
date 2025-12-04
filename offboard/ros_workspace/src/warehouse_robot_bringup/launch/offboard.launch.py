import os
from ament_index_python.packages import get_package_share_path
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch_ros.actions import Node

def generate_launch_description():
    my_robot_navigation_pkg = get_package_share_path('warehouse_navigation')
    nav2_bringup_pkg = get_package_share_path('nav2_bringup')
    ekf_config_path = os.path.join(my_robot_navigation_pkg, 'config', 'ekf.yaml')
    rviz_config_path = os.path.join(my_robot_navigation_pkg, 'config', 'default.rviz')
    nav2_params_path = os.path.join(my_robot_navigation_pkg, 'config', 'nav2_params.yaml')
    # -------------------------------------------------------------------------
    # 1. RViz2
    # -------------------------------------------------------------------------
    rviz2_node = Node(
        package="rviz2",
        executable="rviz2",
        arguments=['-d', rviz_config_path],
        parameters=[{'use_sim_time': False}],
        output='screen'
    )

    # -------------------------------------------------------------------------
    # 2. SLAM Toolbox (Mapper)
    #    Offboard is good for this as it is heavy
    # -------------------------------------------------------------------------
    slam_node = Node(
        package='slam_toolbox',
        executable='async_slam_toolbox_node',
        name='slam_toolbox',
        output='screen',
        parameters=[{
            'use_sim_time': False,
            'base_frame': 'base_link',
            'odom_frame': 'odom', 
            'map_frame': 'map',
            'scan_topic': '/scan',
            'mode': 'mapping',
            'transform_timeout': 0.5,
            'map_update_interval': 5.0,
            'minimum_time_interval': 0.5,
            'transform_publish_period': 0.1,
            'throttle_scans': 1,
            'max_laser_range': 12.0,
            'minimum_travel_distance': 0.1,
            'minimum_travel_heading': 0.1,
            'start_with_default_pose': True,
            'first_map_only': False,
        }],
    )

    robot_localization_node = Node(
        package='robot_localization',
        executable='ekf_node',
        name='ekf_filter_node',
        output='screen',
        parameters=[
            ekf_config_path,
            {'use_sim_time': False}  # False for real robot
        ],
        remappings=[
            ('odometry/filtered', 'odom')  # ← ADD THIS!
        ]
    )
    # -------------------------------------------------------------------------
    # 3. Nav2 (Navigation Stack)
    # -------------------------------------------------------------------------
    nav2_bringup_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(nav2_bringup_pkg, 'launch', 'navigation_launch.py')
        ),
        launch_arguments={
            'use_sim_time': 'false',
            'params_file': nav2_params_path,
            'autostart': 'true',
        }.items()
    )

    return LaunchDescription([
        rviz2_node,
        slam_node,
        nav2_bringup_launch,
        robot_localization_node
    ])