import os
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np
from ultralytics import YOLO
import time
from pyzbar.pyzbar import decode
import sqlite3
from datetime import datetime

class ImageViewer(Node):
    def __init__(self):
        super().__init__('image_viewer')

        # --- CAMERA INITIALIZATION ---
        self.cap = cv2.VideoCapture("/dev/video2")   # ← change index as needed
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        if not self.cap.isOpened():
            self.get_logger().error("Failed to open /dev/video2")
            return

        # --- MODEL INIT ---
        self.get_logger().info('Loading Custom Model...')
        self.device = os.environ.get("DEVICE", "cpu")
        self.model_custom = YOLO('best.pt')
        self.model_custom.to(self.device)
        self.get_logger().info('Custom model loaded.')
        
        # --- DB INIT ---
        self.conn = sqlite3.connect("qr_data.db")
        self.cursor = self.conn.cursor()
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS qr_scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            qr_string TEXT UNIQUE,
            rack_id TEXT,
            shelf_id TEXT,
            item_code TEXT
        )
        """)
        self.conn.commit()

        # --- TIMER LOOP INSTEAD OF SUBSCRIBER ---
        self.timer = self.create_timer(0.03, self.process_frame)

        self.prev_time = time.time()
        self.fps = 0.0
        cv2.namedWindow("YOLO + QR Detection", cv2.WINDOW_NORMAL)


    def parse_qr_string(self, qr_str):
        try:
            parts = qr_str.split("_")
            return parts[0], parts[1], parts[2]
        except:
            return None, None, None

    def save_qr_to_db(self, qr_str):
        rack_id, shelf_id, item_code = self.parse_qr_string(qr_str)
        if rack_id is None:
            self.get_logger().warn(f"Invalid QR format: {qr_str}")
            return
        try:
            self.cursor.execute("""
            INSERT INTO qr_scans (timestamp, qr_string, rack_id, shelf_id, item_code)
            VALUES (?, ?, ?, ?, ?)
            """, (datetime.now().isoformat(), qr_str, rack_id, shelf_id, item_code))
            self.conn.commit()
        except sqlite3.IntegrityError:
            self.get_logger().info(f"Duplicate ignored: {qr_str}")

    def process_frame(self):
        ret, cv_image = self.cap.read()
        if not ret:
            self.get_logger().warn("Camera frame not received.")
            return

        # YOLO
        results_custom = self.model_custom(cv_image, conf=0.5, verbose=False, device=self.device)
        final_frame = results_custom[0].plot()

        # QR detection
        decoded_objects = decode(cv_image)
        for obj in decoded_objects:
            qr_data = obj.data.decode()
            self.get_logger().info(f"QR FOUND: {qr_data}")
            self.save_qr_to_db(qr_data)

            points = obj.polygon
            if len(points) == 4:
                pts = np.array(points, np.int32)
                cv2.polylines(final_frame, [pts], True, (255, 0, 255), 3)

            rect = obj.rect
            cv2.putText(final_frame, qr_data, (rect.left, rect.top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 255), 2)

        # FPS
        now = time.time()
        self.fps = 1.0 / (now - self.prev_time)
        self.prev_time = now

        count_custom = len(results_custom[0].boxes)

        cv2.putText(final_frame, f"FPS: {self.fps:.1f}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
        cv2.putText(final_frame,
                    f"Detections: {count_custom} | QR: {len(decoded_objects)}",
                    (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                    (0, 255, 255), 2)

        cv2.imshow("YOLO + QR Detection", final_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            rclpy.shutdown()


def main(args=None):
    rclpy.init(args=args)
    node = ImageViewer()
    rclpy.spin(node)
    node.destroy_node()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
