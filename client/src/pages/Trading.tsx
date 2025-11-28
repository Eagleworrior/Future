import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSETS, generateData } from "@/lib/mockData";
import { useState, useEffect, useRef } from "react";
import { ComposedChart, Bar, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, ReferenceLine } from "recharts";
import { ArrowDown, ArrowUp, TrendingUp, Activity, Clock, Users, Target, Trophy, Zap, AlertCircle, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Bird chirping sound effect
const playBirdChirp = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [800, 1200, 1000, 1400, 950];
    const now = audioContext.currentTime;
    
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.12);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.12);
    });
  } catch (e) {
    // Audio context not available
  }
};

// Win/Profit sound effect - ascending cheerful tones
const playWinSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C high
    const now = audioContext.currentTime;
    
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.25);
      
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.25);
    });
  } catch (e) {
    // Audio context not available
  }
};

// Loss sound effect - descending sad tones
const playLossSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 392, 329.63, 261.63]; // C, G, E, C low
    const now = audioContext.currentTime;
    
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.3);
      
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.3);
    });
  } catch (e) {
    // Audio context not available
  }
};

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
  const [demoBalance, setDemoBalance] = useState(1000.00);
  const [realBalance, setRealBalance] = useState(0.00);
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
  const { toast } = useToast();
  const entryPriceRef = useRef(lastPrice);

  // Update balance based on account type
  useEffect(() => {
    setBalance(accountType === "demo" ? demoBalance : realBalance);
  }, [accountType, demoBalance, realBalance]);

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
          volume: Math.floor(Math.random() * 1000),
          rsi: Math.random() * 100,
          ma20: newClose + (Math.random() - 0.5) * 2,
          ma50: newClose + (Math.random() - 0.5) * 3,
          bb_upper: newClose + Math.random() * 2,
          bb_lower: newClose - Math.random() * 2,
        };
        
        return [...prev.slice(1), newPoint];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Check active trade expiration and bird chirp countdown
  const lastChirpTimeRef = useRef(-1);
  
  useEffect(() => {
    if (!activeTrade) {
      lastChirpTimeRef.current = -1;
      return;
    }
    
    const checkTrade = setInterval(() => {
      const elapsed = (Date.now() - activeTrade.startTime) / 1000;
      const timeLeft = Math.max(0, Math.ceil(activeTrade.timeFrame - elapsed));
      
      // Play bird chirp every second from 5 seconds to 0
      if (timeLeft <= 5 && timeLeft > 0 && lastChirpTimeRef.current !== timeLeft) {
        playBirdChirp();
        lastChirpTimeRef.current = timeLeft;
      }
      
      if (elapsed >= activeTrade.timeFrame) {
        closeTrade();
      }
    }, 200);
    
    return () => clearInterval(checkTrade);
  }, [activeTrade]);

  const closeTrade = () => {
    if (!activeTrade) return;

    const currentPrice = lastPrice;
    const priceUp = currentPrice > activeTrade.entryPrice;
    const isWin = (activeTrade.type === "CALL" && priceUp) || (activeTrade.type === "PUT" && !priceUp);
    
    // Play appropriate sound effect
    if (isWin) {
      playWinSound();
    } else {
      playLossSound();
    }
    
    // Profit calculation: For wins add profit, for losses keep balance same (amount already deducted when trade placed)
    const profit = isWin ? activeTrade.amount * (selectedAsset.rate / 100) : 0;
    const newBalance = balance + profit;
    const profitPercent = isWin ? (profit / activeTrade.amount) * 100 : -100;

    if (accountType === "demo") {
      setDemoBalance(newBalance);
    } else {
      setRealBalance(newBalance);
    }
    
    setTrades([
      {
        ...activeTrade,
        exitPrice: currentPrice,
        profit: isWin ? profit : -activeTrade.amount,
        profitPercent,
        status: isWin ? "won" : "lost",
        result: isWin ? "WIN" : "LOSS",
      },
      ...trades
    ]);

    toast({
      title: isWin ? "Trade Won! 🎉" : "Trade Lost",
      description: `${activeTrade.type} ${activeTrade.asset} • ${isWin ? "+" : "-"}$${(isWin ? profit : activeTrade.amount).toFixed(2)}`,
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
    if (accountType === "demo") {
      setDemoBalance(newBalance);
    } else {
      setRealBalance(newBalance);
    }
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
  const latestCandle = data[data.length - 1];
  const rsiValue = latestCandle.rsi || 50;
  const rsiSignal = rsiValue > 70 ? "Overbought" : rsiValue < 30 ? "Oversold" : "Neutral";
  const rsiColor = rsiValue > 70 ? "text-chart-down" : rsiValue < 30 ? "text-chart-up" : "text-muted-foreground";

  return (
    <Shell>
      <div className="h-full w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border h-16 flex items-center justify-between px-6 bg-gradient-to-r from-card/50 to-accent/20 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold font-display">Trading</h1>
            <Badge 
              variant={accountType === "demo" ? "outline" : "default"} 
              className="cursor-pointer" 
              onClick={() => setAccountType(accountType === "demo" ? "real" : "demo")}
            >
              {accountType === "demo" ? `📚 Demo • $${demoBalance.toFixed(2)}` : `💰 Real • $${realBalance.toFixed(2)}`}
            </Badge>
            <Badge className="bg-gold/20 text-gold border-gold/30">⭐ Premium</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className={cn("text-2xl font-mono font-bold", balance === 0 ? "text-chart-down" : "text-gold")}>
                ${balance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden p-6 min-h-0">
          {/* Main Trading Area */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
            {/* Main Candlestick Chart */}
            <Card className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-background/80 to-background min-h-0">
              {/* Asset & Price Bar */}
              <div className="h-16 border-b border-border flex items-center justify-between px-6 gap-4 bg-accent/30 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <Select 
                    value={selectedAsset.symbol} 
                    onValueChange={(val) => setSelectedAsset(ASSETS.find(a => a.symbol === val) || ASSETS[0])}
                  >
                    <SelectTrigger className="w-[200px] border-none bg-transparent focus:ring-0 text-lg font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {ASSETS.map(asset => (
                        <SelectItem key={asset.symbol} value={asset.symbol}>
                          {asset.symbol} • {asset.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className={cn(priceChange >= 0 ? "bg-chart-up/20 text-chart-up border-chart-up/30" : "bg-chart-down/20 text-chart-down border-chart-down/30", "border")}>
                      {priceChange >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {Math.abs(priceChange).toFixed(2)}%
                    </Badge>
                    <div className="text-3xl font-mono font-bold">{lastPrice.toFixed(4)}</div>
                  </div>
                </div>
              </div>

              {/* Main Candlestick Chart with Technical Indicators */}
              <div className="flex-1 w-full bg-gradient-to-b from-background/50 to-background p-4 overflow-hidden min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 60 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.15} vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      domain={['auto', 'auto']}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '2px solid hsl(var(--primary))',
                        borderRadius: '8px',
                        padding: '10px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: any) => {
                        if (typeof value === 'number') return value.toFixed(4);
                        return value;
                      }}
                    />
                    
                    {/* Bollinger Bands */}
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="bb_upper"
                      stroke="hsl(var(--muted-foreground))"
                      fill="none"
                      isAnimationActive={false}
                      strokeWidth={1}
                      strokeDasharray="5,5"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="bb_lower"
                      stroke="hsl(var(--muted-foreground))"
                      fill="none"
                      isAnimationActive={false}
                      strokeWidth={1}
                      strokeDasharray="5,5"
                    />
                    
                    {/* Moving Averages */}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ma50"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ma20"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                    
                    {/* Price Area */}
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
                    
                    {/* Volume Bars */}
                    <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.15} yAxisId="right" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Technical Analysis Indicators */}
            <div className="grid grid-cols-4 gap-3 flex-shrink-0">
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">RSI (14)</div>
                <div className={cn("text-lg font-bold", rsiColor)}>{rsiValue.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">{rsiSignal}</div>
              </Card>
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">MA (20)</div>
                <div className="text-lg font-bold text-primary">${(latestCandle.ma20 || lastPrice).toFixed(4)}</div>
              </Card>
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">MA (50)</div>
                <div className="text-lg font-bold text-primary">${(latestCandle.ma50 || lastPrice).toFixed(4)}</div>
              </Card>
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">Volume</div>
                <div className="text-lg font-bold">{(latestCandle.volume || 0).toLocaleString()}</div>
              </Card>
            </div>
          </div>

          {/* Trading Controls Sidebar */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto max-h-full min-h-0">
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
                    <span className={cn("font-mono", lastPrice > activeTrade.entryPrice ? "text-chart-up" : "text-chart-down")}>
                      ${lastPrice.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-lg">
                    <div className="flex items-center gap-2">
                      <span>Time Left:</span>
                      {timeRemaining === 5 && <Volume2 className="w-4 h-4 text-gold animate-pulse" />}
                    </div>
                    <span className={cn("text-xl font-mono", timeRemaining <= 10 ? "text-chart-down animate-pulse" : "text-chart-up")}>{timeRemaining}s</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-lg h-2 mt-3 overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", timeRemaining <= 5 ? "bg-gradient-to-r from-chart-down to-red-500" : "bg-gradient-to-r from-primary to-accent")}
                      style={{ width: `${(timeRemaining / activeTrade.timeFrame) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Real Account Warning */}
            {accountType === "real" && realBalance === 0 && (
              <Card className="border-orange-500/50 bg-orange-500/10 p-3">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-orange-500/80">
                    <p className="font-bold mb-1">Real Account Empty</p>
                    <p>Deposit funds to start trading with real money</p>
                  </div>
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
                    disabled={!!activeTrade || balance === 0}
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
                    disabled={!!activeTrade || balance === 0}
                    className="h-20 flex flex-col gap-1 bg-chart-up hover:bg-chart-up/90 text-white border-none disabled:opacity-50"
                  >
                    <ArrowUp className="w-6 h-6" />
                    <span className="font-bold">CALL</span>
                    <span className="text-xs">{selectedAsset.rate}%</span>
                  </Button>
                  <Button 
                    onClick={() => placeTrade("PUT")}
                    disabled={!!activeTrade || balance === 0}
                    className="h-20 flex flex-col gap-1 bg-chart-down hover:bg-chart-down/90 text-white border-none disabled:opacity-50"
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
                    <div key={trade.id} className={cn("p-2 rounded text-xs", trade.status === "won" ? "bg-chart-up/10 border border-chart-up/30" : "bg-chart-down/10 border border-chart-down/30")}>
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
