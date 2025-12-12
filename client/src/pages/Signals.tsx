import { useState, useEffect } from 'react';
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Settings, Send } from 'lucide-react';

const MOCK_SIGNALS = [
  {
    id: 1, asset: 'AUD/USD OTC', amount: 1, copied: 0, direction: 'both', outcome: 'loss',
    time: '04:30', duration: 300, posted: '30 sec ago'
  },
  {
    id: 2, asset: 'AUD/USD OTC', amount: 1, copied: 25, direction: 'up', outcome: 'loss',
    time: '00:15', duration: 60, posted: '45 sec ago'
  },
  {
    id: 3, asset: 'AUD/USD OTC', amount: 1, copied: 66, direction: 'down', outcome: 'win',
    time: '01:00', duration: 180, posted: '1 min ago'
  },
  {
    id: 4, asset: 'AUD/USD OTC', amount: 1, copied: 99, direction: 'both', outcome: 'win',
    time: '01:45', duration: 300, posted: '1 min ago'
  },
  {
    id: 5, asset: 'AUD/USD OTC', amount: 1, copied: 20, direction: 'down', outcome: 'win',
    time: '03:45', duration: 600, posted: '1 min ago'
  },
  {
    id: 6, asset: 'AUD/USD OTC', amount: 1, copied: 26, direction: 'down', outcome: 'loss',
    time: '08:30', duration: 900, posted: '1 min ago'
  },
  {
    id: 7, asset: 'AUD/USD OTC', amount: 1, copied: 36, direction: 'up', outcome: 'loss',
    time: '13:00', duration: 1800, posted: '2 min ago'
  },
];

const SignalDirection = ({ direction, outcome }: { direction: string, outcome: string }) => {
  const color = outcome === 'win' ? 'text-green-400' : 'text-red-400';
  if (direction === 'up') return <ArrowUp className={cn("w-5 h-5", color)} />;
  if (direction === 'down') return <ArrowDown className={cn("w-5 h-5", color)} />;
  return (
    <div className="flex flex-col">
      <ArrowUp className="w-4 h-4 text-slate-500 -mb-1" />
      <ArrowDown className="w-4 h-4 text-slate-500 -mt-1" />
    </div>
  );
};

export default function Signals() {
  const [signals, setSignals] = useState(MOCK_SIGNALS);
  const [activeTab, setActiveTab] = useState("updates");

  const handleCopySignal = (signalId: number) => {
    console.log(`Copying signal with ID: ${signalId}`);
    // Here you would typically navigate to the trade screen with pre-filled parameters
  };

  return (
    <Shell>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Signals</h1>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={activeTab === "updates" ? "default" : "outline"}
            onClick={() => setActiveTab("updates")}
            className="flex-1"
          >
            Updates
          </Button>
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className="flex-1"
          >
            All
          </Button>
          <Button variant="outline" size="icon"><Settings className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon"><Send className="w-4 h-4" /></Button>
        </div>

        <div className="space-y-3">
          {signals.map(signal => (
            <Card key={signal.id} className="bg-slate-900/50 border-slate-800 p-3 flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <p className="font-bold text-white">{signal.asset}</p>
                <p className="text-sm text-slate-300">${signal.amount}</p>
                <p className="text-xs text-slate-400">Copied: {signal.copied} times</p>
              </div>
              <div className="w-28 flex flex-col items-center gap-1">
                <div className="flex items-center justify-between w-full">
                  <SignalDirection direction={signal.direction} outcome={signal.outcome} />
                  <p className={cn("text-xs font-mono", signal.outcome === 'win' ? 'text-green-400' : 'text-red-400')}>
                    {signal.outcome === 'win' ? '+' : '-'}$ 
                  </p>
                </div>
                <Progress value={(30 / signal.duration) * 100} className="h-1 bg-slate-700" />
                <div className="text-xs text-slate-400 w-full text-right font-mono">{signal.time}</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                  <Button onClick={() => handleCopySignal(signal.id)} className="bg-green-600 hover:bg-green-700 w-28">
                      Copy signal
                  </Button>
                  <p className="text-xs text-slate-500 h-4">{signal.posted}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
