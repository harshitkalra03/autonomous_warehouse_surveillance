import { useState, useEffect } from 'react';
import { useROS } from '@/hooks/useROS';
import { Header } from '@/components/Header';
import { MapViewer } from '@/components/MapViewer';
import { VelocityPanel } from '@/components/VelocityPanel';
import { BatteryPanel } from '@/components/BatteryPanel';
import { SensorPanel } from '@/components/SensorPanel';
import { TopicMonitor } from '@/components/TopicMonitor';
import { QRImagePanel } from '@/components/QRImagePanel';
import { ConnectionConfig } from '@/components/ConnectionConfig';
import { DataPanel } from '@/components/DataPanel';
import { DataValue } from '@/components/DataValue';
import { Map, Cpu, Clock, Thermometer } from 'lucide-react';

const Index = () => {
  const [wsUrl, setWsUrl] = useState('ws://localhost:9090');
  const {
    connected,
    connecting,
    topicData,
    connect,
    disconnect,
    subscribe,
    ros,
  } = useROS({ url: wsUrl });

  // Subscribe to common ROS2 topics when connected
  useEffect(() => {
    if (connected) {
      subscribe('/cmd_vel', 'geometry_msgs/Twist');
      subscribe('/odom', 'nav_msgs/Odometry');
      subscribe('/battery_state', 'sensor_msgs/BatteryState');
      subscribe('/scan', 'sensor_msgs/LaserScan');
    }
  }, [connected, subscribe]);

  // Simulated uptime
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        connected={connected}
        connecting={connecting}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Connection Config */}
        <div className="mb-6">
          <ConnectionConfig
            url={wsUrl}
            onUrlChange={setWsUrl}
            connected={connected}
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <DataPanel
              title="RViz2 Map"
              icon={<Map className="w-4 h-4" />}
              status={connected ? 'active' : 'inactive'}
              className="h-full"
            >
              <MapViewer
                ros={ros}
                connected={connected}
                mapTopic="/map"
                poseTopic="/robot_pose"
              />
            </DataPanel>
          </div>

          {/* Right Column - Status Panels */}
          <div className="space-y-6">
            {/* System Stats */}
            <DataPanel
              title="System Status"
              icon={<Cpu className="w-4 h-4" />}
              status={connected ? 'active' : 'inactive'}
            >
              <div className="grid grid-cols-2 gap-4">
                <DataValue
                  label="Uptime"
                  value={formatUptime(uptime)}
                  size="sm"
                />
                <DataValue
                  label="CPU Temp"
                  value="42"
                  unit="°C"
                  size="sm"
                />
                <DataValue
                  label="Memory"
                  value="68"
                  unit="%"
                  size="sm"
                />
                <DataValue
                  label="Disk"
                  value="45"
                  unit="%"
                  size="sm"
                />
              </div>
            </DataPanel>

            <BatteryPanel data={topicData['/battery_state']} connected={connected} />
          </div>

          {/* Bottom Row */}
          <VelocityPanel data={topicData['/cmd_vel']} connected={connected} />
          <SensorPanel data={topicData} connected={connected} />
          <TopicMonitor topics={topicData} connected={connected} />
        </div>

        {/* QR Image Captures Table - Full Width */}
        <div className="mt-6">
          <QRImagePanel data={undefined} connected={connected} />
        </div>

        {/* Footer Stats */}
        <footer className="mt-8 py-4 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last update: {new Date().toLocaleTimeString()}
              </span>
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                Environment: Normal
              </span>
            </div>
            <span className="font-mono">ROS2 Jazzy • rosbridge_suite v1.3</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
