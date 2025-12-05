import sqlite3
from tabulate import tabulate
import time
import os  # For clearing terminal

def main():
    try:
        while True:
            conn = sqlite3.connect("qr_data.db")
            cursor = conn.cursor()

            # Fetch the entire table and display it each cycle
            cursor.execute("""
                SELECT id, timestamp, qr_string, rack_id, shelf_id, item_code
                FROM qr_scans
                ORDER BY id ASC
            """)
            rows = cursor.fetchall()

            # Clear terminal for clean live view
            os.system('clear')  # 'cls' for Windows

            print("\n📦 FULL QR DATABASE TABLE\n")
            headers = ["ID", "Timestamp", "QR String", "Rack ID", "Shelf ID", "Item Code"]
            if rows:
                print(tabulate(rows, headers=headers, tablefmt="fancy_grid"))
            else:
                print("(no rows found in table 'qr_scans')")

            conn.close()
            time.sleep(1)  # Refresh every 1 second

    except KeyboardInterrupt:
        print("\n💡 Live viewer stopped by user.")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")

if __name__ == "__main__":
    main()
