import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSETS, generateData, SIGNALS } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Bar } from "recharts";
import { ArrowDown, ArrowUp, AlertCircle, TrendingUp, Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Trading() {
  const [data, setData] = useState(generateData(50));
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [amount, setAmount] = useState("100");
  const [balance, setBalance] = useState(1000.00);
  const [lastPrice, setLastPrice] = useState(data[data.length - 1].close);
  const [priceChange, setPriceChange] = useState(0);
  const [trades, setTrades] = useState<any[]>([]);
  const { toast } = useToast();

  // Live data simulation with unpredictable patterns
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const volatility = 0.5 + Math.random() * 1.5; // Higher volatility
        const spike = Math.random() > 0.92 ? (Math.random() > 0.5 ? 2 : -2) : 0; // Random spikes
        const change = (Math.random() - 0.5) * volatility + spike;
        const newClose = Math.max(0.1, last.close + change);
        
        setLastPrice(prevPrice => {
          setPriceChange((newClose - prevPrice) / prevPrice * 100);
          return newClose;
        });
        
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          open: last.close,
          close: newClose,
          high: Math.max(last.close, newClose),
          low: Math.min(last.close, newClose),
          volume: Math.floor(Math.random() * 1000)
        };
        
        return [...prev.slice(1), newPoint];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const placeTrade = async (type: "CALL" | "PUT") => {
    const tradeAmount = parseFloat(amount);
    
    if (!amount || tradeAmount <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    
    if (tradeAmount > balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }

    // Simulate trade with 80% accuracy
    const isWin = Math.random() < 0.80;
    const profit = isWin ? tradeAmount * (selectedAsset.rate / 100) : -tradeAmount;
    const newBalance = balance + profit;

    setBalance(newBalance);
    
    setTrades([
      {
        id: Math.random(),
        asset: selectedAsset.symbol,
        type,
        amount: tradeAmount,
        profit,
        time: new Date().toLocaleTimeString(),
        status: isWin ? "won" : "lost"
      },
      ...trades
    ]);

    toast({
      title: isWin ? "Trade Won! 🎉" : "Trade Lost",
      description: `${type} ${selectedAsset.symbol} • ${profit > 0 ? "+" : ""}$${profit.toFixed(2)}`,
      variant: isWin ? "default" : "destructive"
    });
  };

  return (
    <Shell>
      <div className="h-full flex flex-col md:flex-row">
        {/* Chart Area */}
        <div className="flex-1 relative flex flex-col min-h-[50vh]">
          {/* Asset Selector Bar */}
          <div className="h-16 border-b border-border flex items-center px-6 gap-4 bg-card/50 backdrop-blur-sm z-10">
            <Select 
              value={selectedAsset.symbol} 
              onValueChange={(val) => setSelectedAsset(ASSETS.find(a => a.symbol === val) || ASSETS[0])}
            >
              <SelectTrigger className="w-[180px] border-none bg-transparent hover:bg-accent/10 focus:ring-0 text-lg font-display font-bold">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
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
            
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("bg-opacity-10", priceChange >= 0 ? "bg-green-500 text-green-500 border-green-500/20" : "bg-red-500 text-red-500 border-red-500/20")}>
                  {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                </Badge>
                <div className="text-3xl font-mono font-bold text-white tracking-tight">
                  {lastPrice.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chart with Volume */}
          <div className="flex-1 w-full h-full bg-gradient-to-b from-background to-background/90 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  orientation="right"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                />
                <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.1} yAxisId="right" />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="close" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trading Controls Sidebar */}
        <div className="w-full md:w-96 bg-card border-l border-border p-6 flex flex-col gap-6 z-20 shadow-xl overflow-y-auto">
          {/* Balance Display */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Account Balance</div>
            <div className="text-3xl font-display font-bold text-gold">${balance.toFixed(2)}</div>
          </div>

          {/* Trade Amount */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground uppercase tracking-wider font-medium">
              <span>Trade Amount ($)</span>
              <span>Win: +${(Number(amount) * (selectedAsset.rate/100)).toFixed(2)}</span>
            </div>
            <div className="relative">
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="h-14 text-2xl font-display font-bold bg-background border-border pl-4 pr-4"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {["10", "50", "100", "200", "500"].map(val => (
                <Button 
                  key={val} 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAmount(val)}
                  className={cn("border-dashed border-border hover:border-primary/50 text-xs", amount === val && "border-primary bg-primary/10")}
                >
                  ${val}
                </Button>
              ))}
            </div>
          </div>

          {/* Call/Put Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => placeTrade("CALL")}
              className="h-24 flex flex-col gap-1 bg-chart-up hover:bg-chart-up/90 text-white border-none shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <span className="text-lg font-bold">CALL</span>
              <ArrowUp className="w-6 h-6" />
              <span className="text-xs opacity-80">{selectedAsset.rate}%</span>
            </Button>
            <Button 
              onClick={() => placeTrade("PUT")}
              className="h-24 flex flex-col gap-1 bg-chart-down hover:bg-chart-down/90 text-white border-none shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <span className="text-lg font-bold">PUT</span>
              <ArrowDown className="w-6 h-6" />
              <span className="text-xs opacity-80">{selectedAsset.rate}%</span>
            </Button>
          </div>

          {/* Signals Section */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold animate-pulse" />
                Live Signals
              </h3>
              <Badge className="bg-gold/20 text-gold border-gold/30 text-xs font-mono flex items-center gap-1">
                <Activity className="w-3 h-3" /> 80% Accuracy
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {SIGNALS.map((signal, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-white/5 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-8 rounded-full", signal.type === "CALL" ? "bg-chart-up" : "bg-chart-down")} />
                    <div>
                      <div className="font-bold text-sm">{signal.asset}</div>
                      <div className="text-xs text-muted-foreground">{signal.time}</div>
                    </div>
                  </div>
                  <div className={cn("font-bold font-display text-sm", signal.type === "CALL" ? "text-chart-up" : "text-chart-down")}>
                    {signal.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          {trades.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-display font-bold text-sm mb-3 uppercase tracking-wider">Recent Trades</h3>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {trades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className={cn("p-2 rounded text-xs", trade.status === "won" ? "bg-chart-up/10 text-chart-up" : "bg-chart-down/10 text-chart-down")}>
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold">{trade.type} {trade.asset}</span>
                      <span className={cn("font-bold", trade.profit > 0 && "text-chart-up", trade.profit < 0 && "text-chart-down")}>
                        {trade.profit > 0 ? "+" : ""}{trade.profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">${trade.amount} • {trade.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
