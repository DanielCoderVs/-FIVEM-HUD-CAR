import React, { useState, useEffect } from 'react';
import { Gauge, Fuel, Battery, ThermometerSun, Navigation, AlertTriangle, Radio, Shield, Map, Wallet } from 'lucide-react';

function App() {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState('N');
  const [fuel, setFuel] = useState(75);
  const [temp, setTemp] = useState(90);
  const [time, setTime] = useState('');
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(100);
  const [location, setLocation] = useState('Downtown Los Santos');
  const [money, setMoney] = useState(25000);
  const [bank, setBank] = useState(150000);

  // Simulate car and player data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const change = Math.random() * 2 - 1;
        return Math.max(0, Math.min(200, prev + change));
      });
      setRpm((prev) => {
        const change = Math.random() * 0.1 - 0.05;
        return Math.max(0, Math.min(1, prev + change));
      });
      // Simulate gear changes based on speed
      if (speed < 20) setGear('1');
      else if (speed < 40) setGear('2');
      else if (speed < 70) setGear('3');
      else if (speed < 100) setGear('4');
      else if (speed < 140) setGear('5');
      else setGear('6');
      
      setTime(new Date().toLocaleTimeString());
      
      // Simulate random health/armor changes
      setHealth((prev) => Math.max(0, Math.min(100, prev + (Math.random() * 2 - 1))));
      setArmor((prev) => Math.max(0, Math.min(100, prev + (Math.random() * 2 - 1))));
    }, 100);

    return () => clearInterval(interval);
  }, [speed]);

  const rpmPercentage = rpm * 100;
  const rpmColor = rpmPercentage > 80 ? 'bg-red-500' : rpmPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500';
  const formatMoney = (amount: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);

  return (
    <div className="relative min-h-screen">
      {/* Top HUD - Player Stats */}
      <div className="absolute top-4 right-4 left-4 flex justify-between items-start">
        <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/10 flex items-center space-x-4">
          <StatusBar icon={<Shield className="w-5 h-5 text-blue-400" />} value={health} color="bg-blue-500" />
          <StatusBar icon={<Shield className="w-5 h-5 text-yellow-400" />} value={armor} color="bg-yellow-500" />
        </div>
        <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/10">
          <div className="flex items-center space-x-4">
            <Wallet className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm text-green-400">{formatMoney(money)}</div>
              <div className="text-xs text-gray-400">{formatMoney(bank)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Time */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
        <div className="flex items-center space-x-2">
          <Map className="w-4 h-4 text-white/60" />
          <span className="text-sm font-medium">{location}</span>
          <span className="text-sm text-white/60">|</span>
          <span className="text-sm">{time}</span>
        </div>
      </div>

      {/* Bottom HUD - Vehicle Info */}
      <div className="absolute bottom-8 left-4 right-4">
        <div className="w-full max-w-6xl mx-auto bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="grid grid-cols-5 gap-6">
            {/* Left Section - Speed and RPM */}
            <div className="col-span-2 space-y-4">
              <div className="text-7xl font-bold tracking-wider text-center">
                {Math.round(speed)}
                <span className="text-xl text-gray-400 ml-2">km/h</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full transition-all duration-300 ${rpmColor}`}
                  style={{ width: `${rpmPercentage}%` }}
                />
              </div>
              {/* Enhanced Gear Display */}
              <div className="relative">
                <div className="absolute -left-4 -right-4 -top-2 -bottom-2 bg-white/5 rounded-lg -z-10"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">MARCHA</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">
                    {gear}
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section - Vehicle Status */}
            <div className="col-span-2 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-6">
                <StatusIndicator icon={<Fuel className="w-6 h-6" />} value={`${fuel}%`} label="Combustível" />
                <StatusIndicator icon={<Battery className="w-6 h-6" />} value="Bom" label="Bateria" />
                <StatusIndicator icon={<ThermometerSun className="w-6 h-6" />} value={`${temp}°C`} label="Temperatura" />
                <StatusIndicator icon={<Radio className="w-6 h-6" />} value="87.9" label="Rádio" />
              </div>
            </div>

            {/* Right Section - Alerts */}
            <div className="col-span-1 flex flex-col justify-center space-y-4">
              <AlertIndicator active={rpm > 0.8} message="RPM Alto" />
              <AlertIndicator active={fuel < 20} message="Combustível Baixo" />
              <AlertIndicator active={temp > 110} message="Temperatura Alta" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusBarProps {
  icon: React.ReactNode;
  value: number;
  color: string;
}

function StatusBar({ icon, value, color }: StatusBarProps) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

interface StatusIndicatorProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatusIndicator({ icon, value, label }: StatusIndicatorProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-white/5 rounded-lg">
        {icon}
      </div>
      <div>
        <span className="block text-sm font-medium">{value}</span>
        <span className="block text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );
}

interface AlertIndicatorProps {
  active: boolean;
  message: string;
}

function AlertIndicator({ active, message }: AlertIndicatorProps) {
  if (!active) return null;

  return (
    <div className="flex items-center space-x-2 text-red-500 animate-pulse bg-red-500/10 px-3 py-2 rounded-lg">
      <AlertTriangle className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export default App;