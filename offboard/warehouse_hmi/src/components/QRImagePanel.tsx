import { QrCode, Clock } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import * as ROSLIB from 'roslib';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QRImageData {
  timestamp: string;
  qrString: string;
  rackId: string;
  shelfId: string;
  itemCode: string;
}

interface QRImagePanelProps {
  ros: ROSLIB.Ros | null;
  data?: QRImageData[];
  connected: boolean;
}

export const QRImagePanel = ({ ros, data, connected }: QRImagePanelProps) => {
  const [qrImages, setQrImages] = useState<QRImageData[]>(data || []);

  useEffect(() => {
    if (!ros || !connected) return;

    const qrTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/qr_data',
      messageType: 'std_msgs/String',
    });

    qrTopic.subscribe((message: any) => {
      const qrString = message.data;

      // Parse QR format: R03_S2_ITM430
      // Expected: RACK_SHELF_ITEM
      const parts = qrString.split('_');

      let rackId = 'UNKNOWN';
      let shelfId = 'UNKNOWN';
      let itemCode = 'UNKNOWN';

      if (parts.length >= 3) {
        rackId = `RACK-${parts[0].replace('R', '')}`;
        shelfId = `SHELF-${parts[1].replace('S', '')}`;
        itemCode = `ITEM-${parts[2].replace('ITM', '')}`;
      }

      const newQR: QRImageData = {
        timestamp: new Date().toLocaleString(),
        qrString: qrString,
        rackId: rackId,
        shelfId: shelfId,
        itemCode: itemCode,
      };

      setQrImages((prev) => [newQR, ...prev]);
    });

    return () => {
      qrTopic.unsubscribe();
    };
  }, [ros, connected]);

  return (
    <DataPanel
      title="QR Image Captures"
      icon={<QrCode className="w-4 h-4" />}
      status={connected ? 'active' : 'inactive'}
      className="h-full flex flex-col"
    >
      <div className="flex-1 overflow-y-auto scrollbar-techy">
        {qrImages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <QrCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No QR captures yet</p>
            <p className="text-xs mt-1">QR codes will appear here when captured</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/30">
                <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Time Stamp
                  </div>
                </TableHead>
                <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                  QR String
                </TableHead>
                <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                  Rack ID
                </TableHead>
                <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                  Shelf ID
                </TableHead>
                <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                  Item Code
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrImages.map((qr, index) => (
                <TableRow
                  key={index}
                  className="border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {qr.timestamp}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground break-all">
                    {qr.qrString}
                  </TableCell>
                  <TableCell className="font-mono text-sm font-semibold text-primary">
                    {qr.rackId}
                  </TableCell>
                  <TableCell className="font-mono text-sm font-semibold text-foreground">
                    {qr.shelfId}
                  </TableCell>
                  <TableCell className="font-mono text-sm font-semibold text-foreground">
                    {qr.itemCode}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DataPanel>
  );
};

