import { MoveRight, RotateCw } from 'lucide-react';
import { DataPanel } from './DataPanel';
import { DataValue } from './DataValue';

interface VelocityData {
  linear?: { x: number; y: number; z: number };
  angular?: { x: number; y: number; z: number };
}

interface VelocityPanelProps {
  data?: VelocityData;
  connected: boolean;
}

export const VelocityPanel = ({ data, connected }: VelocityPanelProps) => {
  const linearX = data?.linear?.x ?? 0;
  const angularZ = data?.angular?.z ?? 0;

  return (
    <DataPanel
      title="Velocity"
      icon={<MoveRight className="w-4 h-4" />}
      status={connected ? 'active' : 'inactive'}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <DataValue
            label="Linear X"
            value={linearX.toFixed(3)}
            unit="m/s"
            highlight={Math.abs(linearX) > 0.1}
          />
          <div className="flex-1 mx-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-300"
                style={{ width: `${Math.min(Math.abs(linearX) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <DataValue
            label="Angular Z"
            value={angularZ.toFixed(3)}
            unit="rad/s"
            highlight={Math.abs(angularZ) > 0.1}
          />
          <div className="flex items-center gap-2">
            <RotateCw
              className="w-5 h-5 text-primary transition-transform duration-300"
              style={{ transform: `rotate(${angularZ * 180}deg)` }}
            />
          </div>
        </div>
      </div>
    </DataPanel>
  );
};
