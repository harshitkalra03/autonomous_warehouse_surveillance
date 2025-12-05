import { Battery, BatteryCharging, BatteryLow, BatteryWarning } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { cn } from '@/lib/utils';

interface BatteryData {
  percentage?: number;
  voltage?: number;
  current?: number;
  charging?: boolean;
}

interface BatteryPanelProps {
  data?: BatteryData;
  connected: boolean;
}

export const BatteryPanel = ({ data, connected }: BatteryPanelProps) => {
  const percentage = data?.percentage ?? 85;
  const voltage = data?.voltage ?? 24.5;
  const current = data?.current ?? 2.3;
  const charging = data?.charging ?? false;

  const getBatteryIcon = () => {
    if (charging) return BatteryCharging;
    if (percentage < 20) return BatteryLow;
    if (percentage < 40) return BatteryWarning;
    return Battery;
  };

  const BatteryIcon = getBatteryIcon();

  const getStatus = () => {
    if (!connected) return 'inactive';
    if (percentage < 20) return 'error';
    if (percentage < 40) return 'warning';
    return 'active';
  };

  return (
    <DataPanel
      title="Power System"
      icon={<BatteryIcon className="w-4 h-4" />}
      status={getStatus()}
    >
      <div className="space-y-4">
        {/* Battery level visualization */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 h-8 bg-muted rounded border border-border/50 overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  percentage > 60 && 'bg-gradient-to-r from-success/70 to-success',
                  percentage <= 60 && percentage > 30 && 'bg-gradient-to-r from-warning/70 to-warning',
                  percentage <= 30 && 'bg-gradient-to-r from-destructive/70 to-destructive'
                )}
                style={{ width: `${percentage}%` }}
              />
              {/* Battery segments */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-background/30 last:border-r-0" />
                ))}
              </div>
            </div>
            <span className="text-2xl font-mono font-bold text-foreground w-16 text-right">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Voltage and Current */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Voltage</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-semibold text-foreground">
                {voltage.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">V</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Current</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-semibold text-foreground">
                {current.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">A</span>
            </div>
          </div>
        </div>

        {/* Charging status */}
        {charging && (
          <div className="flex items-center gap-2 text-success text-sm">
            <BatteryCharging className="w-4 h-4 animate-pulse" />
            <span>Charging</span>
          </div>
        )}
      </div>
    </DataPanel>
  );
};
