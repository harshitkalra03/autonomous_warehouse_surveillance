import { QrCode, Clock, Trash2 } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { useEffect, useState } from 'react';
import * as ROSLIB from 'roslib';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QRImageData {
  id: string;
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
  const MAX_RECORDS = 1000;

  useEffect(() => {
    if (!ros || !connected) return;

    const qrTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/qr_data',
      messageType: 'std_msgs/String',
    });

    qrTopic.subscribe((message: any) => {
      const qrString = message.data;
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
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleString(),
        qrString: qrString,
        rackId: rackId,
        shelfId: shelfId,
        itemCode: itemCode,
      };

      setQrImages((prev) => {
        const updated = [newQR, ...prev];
        return updated.slice(0, MAX_RECORDS);
      });
    });

    return () => {
      qrTopic.unsubscribe();
    };
  }, [ros, connected]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all QR records?')) {
      setQrImages([]);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setQrImages((prev) => prev.filter((qr) => qr.id !== id));
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'QR String', 'Rack ID', 'Shelf ID', 'Item Code'],
      ...qrImages.map((qr) => [
        qr.timestamp,
        qr.qrString,
        qr.rackId,
        qr.shelfId,
        qr.itemCode,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr_captures_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <DataPanel
      title="QR Image Captures"
      icon={<QrCode className="w-4 h-4" />}
      status={connected ? 'active' : 'inactive'}
      className="h-full flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-border/30 flex-shrink-0">
        <div className="text-xs text-muted-foreground font-mono">
          {qrImages.length} record{qrImages.length !== 1 ? 's' : ''} stored
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={qrImages.length === 0}
            className="h-7 text-xs"
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleClearAll}
            disabled={qrImages.length === 0}
            className="h-7 text-xs"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {qrImages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <div className="text-center py-8">
              <QrCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No QR captures yet</p>
              <p className="text-xs mt-1">QR codes will appear here when captured</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-auto scrollbar-techy flex-1">
            <Table>
              <TableHeader className="sticky top-0 bg-[#09090b] z-10">
                <TableRow className="border-border/50">
                  <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground w-24">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground min-w-32">
                    QR String
                  </TableHead>
                  <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground w-16">
                    Rack
                  </TableHead>
                  <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground w-16">
                    Shelf
                  </TableHead>
                  <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground w-20">
                    Item
                  </TableHead>
                  <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground w-12">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrImages.map((qr) => (
                  <TableRow
                    key={qr.id}
                    className="border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {qr.timestamp.split(' ')[1]}
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
                    <TableCell className="text-center flex-shrink-0">
                      <button
                        onClick={() => handleDeleteRecord(qr.id)}
                        className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-destructive/20 text-destructive/60 hover:text-destructive transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DataPanel>
  );
};