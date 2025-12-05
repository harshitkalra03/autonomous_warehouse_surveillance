from setuptools import setup
import os
from glob import glob

package_name = 'warehouse_scanning'

setup(
    name=package_name,
    version='1.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'), glob('launch/*.launch.py')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Your Name',
    maintainer_email='your.email@example.com',
    description='YOLO-based object detection with QR code scanning',
    license='MIT',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'image_viewer = warehouse_scanning.qr_detection:main',
            'database_viewer = warehouse_scanning.qr_detection.database_viewer:main',
        ],
    },
)