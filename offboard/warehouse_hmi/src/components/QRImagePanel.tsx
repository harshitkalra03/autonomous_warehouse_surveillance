import { QrCode, Clock } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { cn } from '@/lib/utils';
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
  data?: QRImageData[];
  connected: boolean;
}

export const QRImagePanel = ({ data, connected }: QRImagePanelProps) => {
  // Hardcoded sample data for now - timestamps are fixed capture times
  const qrImages: QRImageData[] = data || [
    {
      timestamp: '12/15/2024, 2:45:30 PM',
      qrString: 'QR-2024-001-ABC123',
      rackId: 'RACK-001',
      shelfId: 'SHELF-03',
      itemCode: 'ITEM-456789',
    },
    {
      timestamp: '12/15/2024, 2:40:15 PM',
      qrString: 'QR-2024-002-XYZ789',
      rackId: 'RACK-002',
      shelfId: 'SHELF-01',
      itemCode: 'ITEM-123456',
    },
    {
      timestamp: '12/15/2024, 2:35:42 PM',
      qrString: 'QR-2024-003-DEF456',
      rackId: 'RACK-001',
      shelfId: 'SHELF-05',
      itemCode: 'ITEM-789012',
    },
  ];

  return (
    <DataPanel
      title="QR Image Captures"
      icon={<QrCode className="w-4 h-4" />}
      status={connected ? 'active' : 'inactive'}
    >
      <div className="max-h-[500px] overflow-y-auto scrollbar-techy">
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

