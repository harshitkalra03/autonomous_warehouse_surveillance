import { Radio, Radar } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { cn } from '@/lib/utils';

interface SensorData {
  lidar?: { ranges: number[]; minRange: number; maxRange: number };
  imu?: { orientation: { x: number; y: number; z: number; w: number } };
  odom?: { position: { x: number; y: number }; velocity: number };
}

interface SensorPanelProps {
  data?: SensorData;
  connected: boolean;
}

export const SensorPanel = ({ data, connected }: SensorPanelProps) => {
  // Simulated sensor data for demo
  const sensors = [
    { name: 'LiDAR', status: connected ? 'active' : 'inactive', hz: 10 },
    { name: 'IMU', status: connected ? 'active' : 'inactive', hz: 100 },
    { name: 'Odometry', status: connected ? 'active' : 'inactive', hz: 50 },
    { name: 'Camera', status: connected ? 'warning' : 'inactive', hz: 30 },
  ];

  return (
    <DataPanel
      title="Sensor Status"
      icon={<Radar className="w-4 h-4" />}
      status={connected ? 'active' : 'inactive'}
    >
      <div className="space-y-3">
        {sensors.map((sensor) => (
          <div
            key={sensor.name}
            className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  sensor.status === 'active' && 'bg-success animate-pulse',
                  sensor.status === 'warning' && 'bg-warning animate-pulse',
                  sensor.status === 'inactive' && 'bg-muted-foreground'
                )}
              />
              <span className="text-sm font-mono text-foreground">{sensor.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                className={cn(
                  'w-3 h-3',
                  sensor.status === 'active' && 'text-success animate-data-stream',
                  sensor.status === 'warning' && 'text-warning',
                  sensor.status === 'inactive' && 'text-muted-foreground'
                )}
              />
              <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                {sensor.status !== 'inactive' ? `${sensor.hz} Hz` : '--'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DataPanel>
  );
};
