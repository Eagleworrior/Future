import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSETS, generateData, SIGNALS } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Trading() {
  const [data, setData] = useState(generateData(50));
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [amount, setAmount] = useState("100");
  const [strikeRate] = useState(82); // Fixed profitability for now

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const volatility = 0.2;
        const change = (Math.random() - 0.5) * volatility;
        const newClose = last.close + change;
        
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          open: last.close,
          close: newClose,
          high: Math.max(last.close, newClose),
          low: Math.min(last.close, newClose)
        };
        
        return [...prev.slice(1), newPoint];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Shell>
      <div className="h-full flex flex-col md:flex-row">
        {/* Chart Area */}
        <div className="flex-1 relative flex flex-col min-h-[50vh]">
          {/* Asset Selector Bar */}
          <div className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card/50 backdrop-blur-sm z-10">
            <Select 
              value={selectedAsset.symbol} 
              onValueChange={(val) => setSelectedAsset(ASSETS.find(a => a.symbol === val) || ASSETS[0])}
            >
              <SelectTrigger className="w-[180px] border-none bg-transparent hover:bg-accent/10 focus:ring-0 text-lg font-display font-bold">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                {ASSETS.map(asset => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex justify-between w-full gap-4">
                      <span>{asset.symbol}</span>
                      <span className="text-green-400">{asset.rate}%</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                +0.45%
              </Badge>
              <div className="text-2xl font-mono font-medium text-white">
                {data[data.length - 1].close.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 w-full h-full bg-gradient-to-b from-background to-background/90 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  orientation="right"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trading Controls Sidebar */}
        <div className="w-full md:w-80 bg-card border-l border-border p-6 flex flex-col gap-6 z-20 shadow-xl">
           <div className="space-y-4">
             <div className="flex justify-between items-center text-sm text-muted-foreground uppercase tracking-wider font-medium">
               <span>Amount ($)</span>
               <span>Profit: +{Math.floor(Number(amount) * (selectedAsset.rate/100))}</span>
             </div>
             <div className="relative">
               <Input 
                 type="number" 
                 value={amount} 
                 onChange={(e) => setAmount(e.target.value)}
                 className="h-14 text-2xl font-display font-bold bg-background border-border pl-4 pr-4"
               />
             </div>
             
             <div className="grid grid-cols-3 gap-2">
               {["50", "100", "200", "500", "1000"].map(val => (
                 <Button 
                   key={val} 
                   variant="outline" 
                   size="sm"
                   onClick={() => setAmount(val)}
                   className={cn("border-dashed border-border hover:border-primary/50", amount === val && "border-primary bg-primary/10")}
                 >
                   ${val}
                 </Button>
               ))}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mt-auto">
             <Button 
               className="h-24 flex flex-col gap-1 bg-chart-up hover:bg-chart-up/90 text-white border-none shadow-[0_0_20px_rgba(34,197,94,0.3)]"
             >
               <span className="text-lg font-bold">CALL</span>
               <ArrowUp className="w-6 h-6" />
               <span className="text-xs opacity-80">{selectedAsset.rate}%</span>
             </Button>
             <Button 
               className="h-24 flex flex-col gap-1 bg-chart-down hover:bg-chart-down/90 text-white border-none shadow-[0_0_20px_rgba(239,68,68,0.3)]"
             >
               <span className="text-lg font-bold">PUT</span>
               <ArrowDown className="w-6 h-6" />
               <span className="text-xs opacity-80">{selectedAsset.rate}%</span>
             </Button>
           </div>

           {/* Signals Section */}
           <div className="mt-6 pt-6 border-t border-border">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-display font-bold text-lg flex items-center gap-2">
                 <Activity className="w-4 h-4 text-primary" />
                 Signals
               </h3>
               <Badge variant="secondary" className="text-xs font-mono">Accuracy: 20%</Badge>
             </div>
             
             <div className="space-y-3">
               {SIGNALS.map((signal, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className={cn("w-2 h-8 rounded-full", signal.type === "CALL" ? "bg-chart-up" : "bg-chart-down")} />
                     <div>
                       <div className="font-bold text-sm">{signal.asset}</div>
                       <div className="text-xs text-muted-foreground">{signal.time}</div>
                     </div>
                   </div>
                   <div className={cn("font-bold font-display", signal.type === "CALL" ? "text-chart-up" : "text-chart-down")}>
                     {signal.type}
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </Shell>
  );
}
