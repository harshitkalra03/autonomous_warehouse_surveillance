import sys
if sys.prefix == '/usr':
    sys.real_prefix = sys.prefix
    sys.prefix = sys.exec_prefix = '/home/sv/ros/software/offboard/ros_workspace/install/warehouse_navigation'
