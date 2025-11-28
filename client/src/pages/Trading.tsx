import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSETS, generateData } from "@/lib/mockData";
import { useState, useEffect, useRef } from "react";
import { ComposedChart, Bar, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { ArrowDown, ArrowUp, TrendingUp, Activity, Clock, Users, Target, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const TIME_FRAMES = [
  { label: "1m", value: 60 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
];

export default function Trading() {
  const [data, setData] = useState(generateData(50));
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [amount, setAmount] = useState("100");
  const [timeFrame, setTimeFrame] = useState(60);
  const [accountType, setAccountType] = useState<"demo" | "real">("demo");
  const [balance, setBalance] = useState(1000.00);
  const [lastPrice, setLastPrice] = useState(data[data.length - 1].close);
  const [priceChange, setPriceChange] = useState(0);
  const [activeTrade, setActiveTrade] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [liveTradesData, setLiveTradesData] = useState<any[]>([
    { time: "14:00", wins: 65, losses: 35 },
    { time: "14:15", wins: 68, losses: 32 },
    { time: "14:30", wins: 72, losses: 28 },
    { time: "14:45", wins: 70, losses: 30 },
    { time: "15:00", wins: 75, losses: 25 },
  ]);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const entryPriceRef = useRef(lastPrice);

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const volatility = 0.5 + Math.random() * 1.5;
        const spike = Math.random() > 0.92 ? (Math.random() > 0.5 ? 2 : -2) : 0;
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

  // Check active trade expiration
  useEffect(() => {
    if (!activeTrade) return;
    
    const checkTrade = setInterval(() => {
      const elapsed = (Date.now() - activeTrade.startTime) / 1000;
      if (elapsed >= activeTrade.timeFrame) {
        closeTrade();
      }
    }, 500);
    
    return () => clearInterval(checkTrade);
  }, [activeTrade]);

  const closeTrade = () => {
    if (!activeTrade) return;

    const currentPrice = lastPrice;
    const priceUp = currentPrice > activeTrade.entryPrice;
    const isWin = (activeTrade.type === "CALL" && priceUp) || (activeTrade.type === "PUT" && !priceUp);
    
    const profit = isWin ? activeTrade.amount * (selectedAsset.rate / 100) : -activeTrade.amount;
    const newBalance = balance + profit;
    const profitPercent = (profit / activeTrade.amount) * 100;

    setBalance(newBalance);
    setTrades([
      {
        ...activeTrade,
        exitPrice: currentPrice,
        profit,
        profitPercent,
        status: isWin ? "won" : "lost",
        result: isWin ? "WIN" : "LOSS",
      },
      ...trades
    ]);

    toast({
      title: isWin ? "Trade Won! 🎉" : "Trade Lost",
      description: `${activeTrade.type} ${activeTrade.asset} • ${profit > 0 ? "+" : ""}$${profit.toFixed(2)}`,
      variant: isWin ? "default" : "destructive"
    });

    setActiveTrade(null);
  };

  const placeTrade = (type: "CALL" | "PUT") => {
    const tradeAmount = parseFloat(amount);
    
    if (!amount || tradeAmount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    
    if (tradeAmount > balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }

    if (activeTrade) {
      toast({ title: "Close active trade first", variant: "destructive" });
      return;
    }

    const newBalance = balance - tradeAmount;
    setBalance(newBalance);
    entryPriceRef.current = lastPrice;

    const trade = {
      id: Math.random(),
      asset: selectedAsset.symbol,
      type,
      amount: tradeAmount,
      entryPrice: lastPrice,
      timeFrame,
      startTime: Date.now(),
      accountType,
      createdAt: new Date().toLocaleTimeString(),
    };

    setActiveTrade(trade);

    toast({
      title: `${type} Trade Opened`,
      description: `${selectedAsset.symbol} • $${tradeAmount.toFixed(2)} • ${timeFrame}s`,
    });
  };

  const timeRemaining = activeTrade ? Math.max(0, Math.ceil(activeTrade.timeFrame - (Date.now() - activeTrade.startTime) / 1000)) : 0;

  return (
    <Shell>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border h-16 flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold font-display">Trading</h1>
            <Badge variant={accountType === "demo" ? "outline" : "default"} className="cursor-pointer" onClick={() => setAccountType(accountType === "demo" ? "real" : "demo")}>
              {accountType === "demo" ? "📚 Demo" : "💰 Real"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className="text-2xl font-mono font-bold text-gold">${balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden p-6">
          {/* Main Trading Area */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Chart */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              {/* Asset & Price Bar */}
              <div className="h-14 border-b border-border flex items-center px-4 gap-4 bg-accent/30">
                <Select 
                  value={selectedAsset.symbol} 
                  onValueChange={(val) => setSelectedAsset(ASSETS.find(a => a.symbol === val) || ASSETS[0])}
                >
                  <SelectTrigger className="w-[180px] border-none bg-transparent focus:ring-0 text-lg font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ASSETS.map(asset => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.symbol} - {asset.rate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="ml-auto flex items-center gap-3">
                  <Badge className={cn(priceChange >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                    {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                  </Badge>
                  <div className="text-3xl font-mono font-bold">{lastPrice.toFixed(4)}</div>
                </div>
              </div>

              {/* Candlestick Chart */}
              <div className="flex-1 w-full bg-gradient-to-b from-background/50 to-background p-4 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.1} yAxisId="right" />
                    <Area yAxisId="left" type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorPrice)" isAnimationActive={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Live Trades Chart */}
            <Card className="h-40">
              <div className="p-3 border-b border-border flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <span className="text-sm font-bold">Live Trading Results</span>
              </div>
              <div className="flex-1 p-2">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={liveTradesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
                    <XAxis dataKey="time" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="wins" stroke="#22c55e" dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="losses" stroke="#ef4444" dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Trading Controls Sidebar */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto">
            {/* Active Trade Info */}
            {activeTrade && (
              <Card className="border-yellow-500/50 bg-yellow-500/10">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Status:</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Entry:</span>
                    <span className="font-mono">${activeTrade.entryPrice.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Current:</span>
                    <span className="font-mono">${lastPrice.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Time Left:</span>
                    <span className="text-lg">{timeRemaining}s</span>
                  </div>
                  <Button onClick={closeTrade} className="w-full mt-2" size="sm" variant="destructive">
                    Close Trade Early
                  </Button>
                </div>
              </Card>
            )}

            {/* Amount & Time Selection */}
            <Card>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount ($)</label>
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-xl font-bold h-12"
                    disabled={!!activeTrade}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Time Frame</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_FRAMES.map(tf => (
                      <Button
                        key={tf.value}
                        variant={timeFrame === tf.value ? "default" : "outline"}
                        onClick={() => setTimeFrame(tf.value)}
                        className="text-sm"
                        disabled={!!activeTrade}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {tf.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => placeTrade("CALL")}
                    disabled={!!activeTrade}
                    className="h-20 flex flex-col gap-1 bg-chart-up hover:bg-chart-up/90 text-white border-none"
                  >
                    <ArrowUp className="w-6 h-6" />
                    <span className="font-bold">CALL</span>
                    <span className="text-xs">{selectedAsset.rate}%</span>
                  </Button>
                  <Button 
                    onClick={() => placeTrade("PUT")}
                    disabled={!!activeTrade}
                    className="h-20 flex flex-col gap-1 bg-chart-down hover:bg-chart-down/90 text-white border-none"
                  >
                    <ArrowDown className="w-6 h-6" />
                    <span className="font-bold">PUT</span>
                    <span className="text-xs">{selectedAsset.rate}%</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Trades */}
            {trades.length > 0 && (
              <Card>
                <div className="p-3 border-b border-border flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold">Recent Trades</span>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {trades.slice(0, 8).map((trade) => (
                    <div key={trade.id} className={cn("p-2 rounded text-xs", trade.status === "won" ? "bg-chart-up/10" : "bg-chart-down/10")}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">{trade.type} {trade.asset}</span>
                        <span className={cn("font-bold", trade.profit > 0 ? "text-chart-up" : "text-chart-down")}>
                          {trade.profit > 0 ? "+" : ""}{trade.profit.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs">${trade.amount} • {trade.createdAt}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
