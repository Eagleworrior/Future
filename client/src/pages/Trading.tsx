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

// Win sound effect - clapping and cheering celebration
const playWinSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    
    // Clapping effect - sharp bursts with white noise
    for (let i = 0; i < 3; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(800 + i * 100, now + i * 0.15);
      osc.frequency.exponentialRampToValueAtTime(500, now + i * 0.15 + 0.08);
      
      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.08);
      
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.08);
    }
    
    // Cheering effect - ascending tones
    const cheerNotes = [880, 1100, 1320];
    cheerNotes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.25, now + 0.5 + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5 + i * 0.1 + 0.15);
      
      osc.start(now + 0.5 + i * 0.1);
      osc.stop(now + 0.5 + i * 0.1 + 0.15);
    });
  } catch (e) {
    // Audio context not available
  }
};

// Loss sound effect - sad/disappointed tones
const playLossSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 392, 329.63, 261.63]; // C, G, E, C low - descending sad
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
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
];

// Candlestick Pattern Detection
const detectCandlestickPatterns = (chartData: any[]) => {
  if (chartData.length < 3) return [];
  
  const patterns: Array<{name: string, confidence: number, direction: "BULLISH" | "BEARISH", icon: string}> = [];
  const latest = chartData[chartData.length - 1];
  const prev1 = chartData[chartData.length - 2];
  const prev2 = chartData[chartData.length - 3];
  
  // Engulfing Pattern
  if (prev1.close > prev1.open && latest.open < latest.close && 
      latest.open < prev1.open && latest.close > prev1.close) {
    patterns.push({ name: "Bullish Engulfing", confidence: 85, direction: "BULLISH", icon: "📈" });
  }
  if (prev1.close < prev1.open && latest.open > latest.close && 
      latest.open > prev1.open && latest.close < prev1.close) {
    patterns.push({ name: "Bearish Engulfing", confidence: 85, direction: "BEARISH", icon: "📉" });
  }
  
  // Hammer Pattern (small body, long lower wick)
  if (latest.close > latest.open && (latest.low < latest.open - (latest.close - latest.open) * 2)) {
    patterns.push({ name: "Hammer", confidence: 72, direction: "BULLISH", icon: "🔨" });
  }
  
  // Shooting Star (small body, long upper wick)
  if (latest.close < latest.open && (latest.high > latest.close + (latest.open - latest.close) * 2)) {
    patterns.push({ name: "Shooting Star", confidence: 72, direction: "BEARISH", icon: "⭐" });
  }
  
  // Doji (open ≈ close)
  if (Math.abs(latest.close - latest.open) < (latest.high - latest.low) * 0.1) {
    patterns.push({ name: "Doji", confidence: 65, direction: "BULLISH", icon: "十" });
  }
  
  // Double Top Pattern (price peaks)
  if (prev2.close < prev2.high && prev1.close < prev1.high && 
      Math.abs(prev2.high - prev1.high) < (prev2.high * 0.01) && 
      latest.close < prev2.high) {
    patterns.push({ name: "Double Top", confidence: 78, direction: "BEARISH", icon: "🏔️" });
  }
  
  // Double Bottom Pattern (price valleys)
  if (prev2.close > prev2.low && prev1.close > prev1.low && 
      Math.abs(prev2.low - prev1.low) < (prev2.low * 0.01) && 
      latest.close > prev2.low) {
    patterns.push({ name: "Double Bottom", confidence: 78, direction: "BULLISH", icon: "⛰️" });
  }
  
  // Triangle Pattern (converging highs and lows)
  if (prev2.high > prev1.high && prev1.high > latest.high &&
      prev2.low < prev1.low && prev1.low < latest.low) {
    patterns.push({ name: "Descending Triangle", confidence: 70, direction: "BEARISH", icon: "📐" });
  }
  
  // Flag Pattern (consolidation after trend)
  if (prev2.close > prev2.open && latest.close > latest.open && 
      Math.abs(latest.close - prev1.close) < Math.abs(prev2.close - prev2.open) * 0.3) {
    patterns.push({ name: "Bullish Flag", confidence: 68, direction: "BULLISH", icon: "🚩" });
  }
  
  return patterns;
};

export default function Trading() {
  const [data, setData] = useState(generateData(50));
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [amount, setAmount] = useState("100");
  const [timeFrame, setTimeFrame] = useState(5);
  const [accountType, setAccountType] = useState<"demo" | "real">("demo");
  const [demoBalance, setDemoBalance] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demoBalance');
      return saved ? parseFloat(saved) : 1000.00;
    }
    return 1000.00;
  });
  const [realBalance, setRealBalance] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('realBalance');
      return saved ? parseFloat(saved) : 0.00;
    }
    return 0.00;
  });
  const [balance, setBalance] = useState(1000.00);
  const [lastPrice, setLastPrice] = useState(data[data.length - 1].close);
  const [priceChange, setPriceChange] = useState(0);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [liveTradesData, setLiveTradesData] = useState<any[]>([
    { time: "14:00", wins: 65, losses: 35 },
    { time: "14:15", wins: 68, losses: 32 },
    { time: "14:30", wins: 72, losses: 28 },
    { time: "14:45", wins: 70, losses: 30 },
    { time: "15:00", wins: 75, losses: 25 },
  ]);
  const [useSignals, setUseSignals] = useState(true);
  const [currentSignal, setCurrentSignal] = useState<{type: "CALL" | "PUT", accuracy: number, strength: "Strong" | "Medium" | "Weak"} | null>(null);
  const [detectedPatterns, setDetectedPatterns] = useState<any[]>([]);
  const { toast } = useToast();
  const entryPriceRef = useRef(lastPrice);

  // Generate trading signals based on technical indicators
  const generateSignal = (chartData: any[]) => {
    if (chartData.length < 5) return null;
    
    const recent = chartData.slice(-5);
    const latest = recent[recent.length - 1];
    const prev = recent[0];
    
    // Calculate indicators
    const rsi = latest.rsi || 50;
    const ma20 = latest.ma20 || latest.close;
    const ma50 = latest.ma50 || latest.close;
    const currentPrice = latest.close;
    
    // Trend analysis
    const priceUptrend = currentPrice > ma20 && ma20 > ma50;
    const priceDowntrend = currentPrice < ma20 && ma20 < ma50;
    const priceMomentum = (currentPrice - prev.close) / prev.close * 100;
    
    let signal: "CALL" | "PUT" | null = null;
    let accuracy = 50;
    let strength: "Strong" | "Medium" | "Weak" = "Weak";
    
    // CALL Signal Conditions
    if (priceUptrend && rsi > 45 && rsi < 70) {
      signal = "CALL";
      accuracy = 72 + (rsi - 45) * 0.3;
      strength = rsi > 60 ? "Strong" : rsi > 50 ? "Medium" : "Weak";
    } else if (rsi < 30 && priceMomentum > 1) {
      signal = "CALL";
      accuracy = 65 + priceMomentum * 2;
      strength = priceMomentum > 3 ? "Strong" : "Medium";
    }
    
    // PUT Signal Conditions
    if (priceDowntrend && rsi < 55 && rsi > 30) {
      signal = "PUT";
      accuracy = 72 - (rsi - 30) * 0.3;
      strength = rsi < 40 ? "Strong" : rsi < 50 ? "Medium" : "Weak";
    } else if (rsi > 70 && priceMomentum < -1) {
      signal = "PUT";
      accuracy = 65 + Math.abs(priceMomentum) * 2;
      strength = Math.abs(priceMomentum) > 3 ? "Strong" : "Medium";
    }
    
    if (signal) {
      return {
        type: signal,
        accuracy: Math.min(95, Math.max(55, accuracy)),
        strength
      };
    }
    
    return null;
  };

  // Update balance based on account type
  useEffect(() => {
    setBalance(accountType === "demo" ? demoBalance : realBalance);
  }, [accountType, demoBalance, realBalance]);

  // Persist balance to localStorage
  useEffect(() => {
    localStorage.setItem('demoBalance', demoBalance.toString());
  }, [demoBalance]);

  useEffect(() => {
    localStorage.setItem('realBalance', realBalance.toString());
  }, [realBalance]);

  // Live data simulation with signal generation
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
        
        const newData = [...prev.slice(1), newPoint];
        
        // Generate signal from new data
        const signal = generateSignal(newData);
        setCurrentSignal(signal);
        
        return newData;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Check active trades expiration
  useEffect(() => {
    if (activeTrades.length === 0) return;
    
    const checkTrades = setInterval(() => {
      activeTrades.forEach(trade => {
        const elapsed = (Date.now() - trade.startTime) / 1000;
        if (elapsed >= trade.timeFrame) {
          closeTradeById(trade.id);
        }
      });
    }, 200);
    
    return () => clearInterval(checkTrades);
  }, [activeTrades]);

  const closeTradeById = (tradeId: number) => {
    const activeTrade = activeTrades.find(t => t.id === tradeId);
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
    
    // Profit calculation:
    // WIN: Return original bet + payout profit to balance
    // LOSS: Balance already deducted - no additional deduction
    const profit = isWin ? activeTrade.amount * (selectedAsset.rate / 100) : 0;
    const newBalance = isWin ? (balance + activeTrade.amount + profit) : balance;
    const profitPercent = isWin ? ((profit / activeTrade.amount) * 100) : -100;

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
      title: isWin ? "✅ Trade Won!" : "❌ Trade Lost",
      description: `${activeTrade.type} ${activeTrade.asset} • ${isWin ? "+" : "-"}$${(isWin ? profit : activeTrade.amount).toFixed(2)} • Bet: $${activeTrade.amount}`,
      variant: isWin ? "default" : "destructive"
    });

    setActiveTrades(activeTrades.filter(t => t.id !== tradeId));
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

    setActiveTrades([...activeTrades, trade]);

    toast({
      title: `${type} Trade Opened`,
      description: `${selectedAsset.symbol} • $${tradeAmount.toFixed(2)} • ${timeFrame}s`,
    });
  };

  // Double Bet Feature - after 15 seconds remaining
  const doubleBet = (tradeId: number) => {
    const activeTrade = activeTrades.find(t => t.id === tradeId);
    if (!activeTrade) return;

    const doubledAmount = activeTrade.amount * 2;
    const currentBalanceAmount = accountType === "demo" ? demoBalance : realBalance;

    if (doubledAmount > currentBalanceAmount) {
      toast({ 
        title: "Insufficient balance to double", 
        description: `Need $${doubledAmount.toFixed(2)} but only have $${currentBalanceAmount.toFixed(2)}`,
        variant: "destructive" 
      });
      return;
    }

    // Deduct doubled amount from balance
    const newBalance = currentBalanceAmount - doubledAmount;
    if (accountType === "demo") {
      setDemoBalance(newBalance);
    } else {
      setRealBalance(newBalance);
    }

    // Update the active trade with doubled amount
    setActiveTrades(activeTrades.map(t => 
      t.id === tradeId ? { ...t, amount: doubledAmount, isDoubled: true } : t
    ));

    toast({
      title: "Bet Doubled! 🎲",
      description: `Bet increased to $${doubledAmount.toFixed(2)}`,
    });
  };

  const getTimeRemaining = (trade: any) => Math.max(0, Math.ceil(trade.timeFrame - (Date.now() - trade.startTime) / 1000));
  const latestCandle = data[data.length - 1];
  const rsiValue = latestCandle.rsi || 50;
  const rsiSignal = rsiValue > 70 ? "Overbought" : rsiValue < 30 ? "Oversold" : "Neutral";
  const rsiColor = rsiValue > 70 ? "text-chart-down" : rsiValue < 30 ? "text-chart-up" : "text-muted-foreground";

  return (
    <Shell>
      <div className="h-full w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Professional Header - Pocket Option Style */}
        <div className="border-b border-slate-600/40 h-14 flex items-center justify-between px-6 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-950/95 backdrop-blur-xl flex-shrink-0 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/75 transition-all">
                <span className="text-white font-bold text-base">🦅</span>
              </div>
              <span className="font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-lg">Expert Trade</span>
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-slate-600/0 via-slate-600/50 to-slate-600/0"></div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setAccountType(accountType === "demo" ? "real" : "demo")}
                className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer duration-300 transform hover:scale-105", 
                  accountType === "demo" 
                    ? "bg-gradient-to-r from-blue-600/30 to-blue-500/20 text-blue-300 border border-blue-400/40 shadow-lg shadow-blue-500/20" 
                    : "bg-gradient-to-r from-green-600/30 to-green-500/20 text-green-300 border border-green-400/40 shadow-lg shadow-green-500/20"
                )}
              >
                {accountType === "demo" ? "📚 Demo" : "💰 Real"}
              </button>
              <div className="text-xs text-slate-400">${(accountType === "demo" ? demoBalance : realBalance).toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-0.5">Account Balance</div>
              <div className={cn("text-xl font-mono font-bold drop-shadow-lg", balance >= 1000 ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]" : balance > 0 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" : "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]")}>
                ${balance.toFixed(2)}
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500/30 to-orange-500/20 border border-yellow-400/50 shadow-lg shadow-yellow-500/30">
              <span className="text-xs font-bold text-yellow-300">⭐ PREMIUM</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden p-4 bg-gradient-to-br from-slate-950 to-black">
          {/* Main Trading Area */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            {/* Main Candlestick Chart */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-900/70 to-slate-950/80 rounded-xl border border-slate-600/40 shadow-2xl hover:shadow-blue-500/20 transition-shadow duration-300">
              {/* Asset & Price Bar */}
              <div className="h-14 border-b border-slate-700 flex items-center justify-between px-5 gap-4 bg-slate-900/80 flex-shrink-0 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <Select 
                    value={selectedAsset.symbol} 
                    onValueChange={(val) => setSelectedAsset(ASSETS.find(a => a.symbol === val) || ASSETS[0])}
                  >
                    <SelectTrigger className="w-[180px] border-none bg-transparent focus:ring-0 text-base font-bold text-white hover:bg-white/5 px-3 py-2 rounded transition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[500px]">
                      {['Forex', 'Crypto', 'Commodity', 'Index', 'Stock'].map(category => {
                        const assets = ASSETS.filter(a => a.type === category);
                        return assets.length > 0 ? (
                          <div key={category}>
                            <div className="px-2 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 sticky top-0 z-10">
                              {category.toUpperCase()} ({assets.length})
                            </div>
                            {assets.map(asset => (
                              <SelectItem key={asset.symbol} value={asset.symbol} className="pl-6">
                                <span className="font-medium">{asset.symbol}</span>
                                <span className="text-slate-500 ml-2">({asset.rate}% payout)</span>
                              </SelectItem>
                            ))}
                          </div>
                        ) : null;
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1", priceChange >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                      {priceChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(priceChange).toFixed(2)}%
                    </div>
                    <div className="text-2xl font-mono font-bold text-white">{lastPrice.toFixed(4)}</div>
                  </div>
                </div>
              </div>

              {/* Main Candlestick Chart with Technical Indicators */}
              <div className="flex-1 w-full bg-black p-3 overflow-hidden min-h-0 rounded-b-lg" style={{ minHeight: "400px" }}>
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
            </div>

            {/* Market Analysis Charts */}
            <div className="grid grid-cols-3 gap-3 flex-shrink-0 h-48">
              {/* RSI Chart */}
              <Card className="bg-gradient-to-b from-background/80 to-background overflow-hidden">
                <div className="p-3 border-b border-border">
                  <h3 className="text-xs font-bold text-muted-foreground">RSI (14)</h3>
                </div>
                <div className="flex-1 p-2 flex items-end justify-between h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} vertical={false} />
                      <YAxis yAxisId="left" domain={[0, 100]} height={0} />
                      <Line yAxisId="left" type="monotone" dataKey="rsi" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <ReferenceLine yAxisId="left" y={70} stroke="hsl(var(--chart-down))" strokeDasharray="5,5" opacity={0.5} />
                      <ReferenceLine yAxisId="left" y={30} stroke="hsl(var(--chart-up))" strokeDasharray="5,5" opacity={0.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="px-3 pb-2 flex justify-between text-xs">
                  <span className="text-muted-foreground">Value:</span>
                  <span className={cn("font-bold", rsiColor)}>{rsiValue.toFixed(1)} ({rsiSignal})</span>
                </div>
              </Card>

              {/* Volume Analysis */}
              <Card className="bg-gradient-to-b from-background/80 to-background overflow-hidden">
                <div className="p-3 border-b border-border">
                  <h3 className="text-xs font-bold text-muted-foreground">Volume Analysis</h3>
                </div>
                <div className="flex-1 p-2 flex items-end h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} vertical={false} />
                      <YAxis yAxisId="right" orientation="right" height={0} />
                      <Bar yAxisId="right" dataKey="volume" fill="hsl(var(--primary))" opacity={0.6} isAnimationActive={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="px-3 pb-2 text-xs">
                  <span className="text-muted-foreground">Current Vol: </span>
                  <span className="font-bold">{(latestCandle.volume || 0).toLocaleString()}</span>
                </div>
              </Card>

              {/* Moving Averages Comparison */}
              <Card className="bg-gradient-to-b from-background/80 to-background overflow-hidden">
                <div className="p-3 border-b border-border">
                  <h3 className="text-xs font-bold text-muted-foreground">MA Comparison</h3>
                </div>
                <div className="flex-1 p-2 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'hsl(var(--chart-3))'}}></div>
                        MA20
                      </span>
                      <span className="font-mono font-bold">${(latestCandle.ma20 || 0).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'hsl(var(--chart-2))'}}></div>
                        MA50
                      </span>
                      <span className="font-mono font-bold">${(latestCandle.ma50 || 0).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'hsl(var(--primary))'}}></div>
                        Current
                      </span>
                      <span className="font-mono font-bold">${lastPrice.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/50 text-xs">
                    <div className={cn("font-bold", (latestCandle.ma20 || 0) > (latestCandle.ma50 || 0) ? "text-chart-up" : "text-chart-down")}>
                      {(latestCandle.ma20 || 0) > (latestCandle.ma50 || 0) ? "🟢 Bullish" : "🔴 Bearish"}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Candlestick Patterns */}
            <Card className="border-2 border-purple-500/50 bg-gradient-to-r from-purple-500/15 to-pink-500/10 p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  📊 Candlestick Patterns
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Live pattern detection from price action</p>
              </div>

              {detectedPatterns.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {detectedPatterns.slice(0, 3).map((pattern, idx) => (
                    <div key={idx} className={cn("p-2 rounded-lg border flex items-center justify-between text-xs", pattern.direction === "BULLISH" ? "border-chart-up/40 bg-chart-up/10" : "border-chart-down/40 bg-chart-down/10")}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{pattern.icon}</span>
                        <div>
                          <div className="font-bold">{pattern.name}</div>
                          <div className={cn("text-xs font-bold", pattern.direction === "BULLISH" ? "text-chart-up" : "text-chart-down")}>
                            {pattern.direction}
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded bg-white/10 text-white font-bold">
                        {pattern.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-muted-foreground bg-secondary/30 rounded">
                  🔍 No significant patterns detected yet
                </div>
              )}
            </Card>

            {/* Trading Signals */}
            <Card className="border-2 border-accent/50 bg-gradient-to-r from-accent/20 to-primary/10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    🎯 AI Trading Signals
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Advanced analysis-based trade recommendations</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{useSignals ? "ON" : "OFF"}</span>
                  <Button
                    size="sm"
                    variant={useSignals ? "default" : "outline"}
                    onClick={() => setUseSignals(!useSignals)}
                    className="w-12 h-6 p-0"
                  >
                    <div className={cn("w-5 h-5 rounded-full bg-white transition-transform", useSignals ? "translate-x-1" : "-translate-x-1")} />
                  </Button>
                </div>
              </div>

              {currentSignal ? (
                <div className={cn("p-3 rounded-lg border-2 text-center", currentSignal.type === "CALL" ? "border-chart-up/50 bg-chart-up/15" : "border-chart-down/50 bg-chart-down/15")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className={cn("px-3 py-1 rounded font-bold text-white text-sm", currentSignal.type === "CALL" ? "bg-chart-up" : "bg-chart-down")}>
                        {currentSignal.type === "CALL" ? "📈 CALL" : "📉 PUT"}
                      </div>
                      <Badge className={currentSignal.strength === "Strong" ? "bg-accent" : currentSignal.strength === "Medium" ? "bg-primary/50" : "bg-muted"}>
                        {currentSignal.strength}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Accuracy:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all", currentSignal.type === "CALL" ? "bg-chart-up" : "bg-chart-down")}
                          style={{ width: `${currentSignal.accuracy}%` }}
                        />
                      </div>
                      <span className="font-bold text-sm min-w-12">{currentSignal.accuracy.toFixed(1)}%</span>
                    </div>
                  </div>
                  {useSignals && (
                    <p className="text-xs text-muted-foreground mt-2">✓ Signal-based trades are active</p>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-border bg-muted/30 text-center text-xs text-muted-foreground">
                  Analyzing market conditions... No clear signal detected yet
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                💡 Tip: Use signals as guidance. Always manage your risk and trade responsibly. Past accuracy doesn't guarantee future results.
              </p>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3 flex-shrink-0">
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">24h High</div>
                <div className="text-lg font-bold text-chart-up">${(Math.max(...data.map(d => d.close)) * 1.02).toFixed(4)}</div>
              </Card>
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">24h Low</div>
                <div className="text-lg font-bold text-chart-down">${(Math.min(...data.map(d => d.close)) * 0.98).toFixed(4)}</div>
              </Card>
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">Volatility</div>
                <div className="text-lg font-bold text-primary">{(Math.random() * 5 + 0.5).toFixed(2)}%</div>
              </Card>
              <Card className="p-3 bg-accent/30 border-border">
                <div className="text-xs text-muted-foreground mb-1">Trend</div>
                <div className={cn("text-lg font-bold", priceChange >= 0 ? "text-chart-up" : "text-chart-down")}>
                  {priceChange >= 0 ? "📈 Up" : "📉 Down"}
                </div>
              </Card>
            </div>
          </div>

          {/* Trading Controls Sidebar */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto max-h-full min-h-0">
            {/* Active Trades Info */}
            {activeTrades.length > 0 && (
              <Card className="border-yellow-500/50 bg-yellow-500/10">
                <div className="p-3 border-b border-yellow-500/30">
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                    {activeTrades.length} Active Trade{activeTrades.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="p-3 space-y-3 max-h-48 overflow-y-auto">
                  {activeTrades.map((trade) => {
                    const tr = getTimeRemaining(trade);
                    const priceUp = lastPrice > trade.entryPrice;
                    const priceDifference = lastPrice - trade.entryPrice;
                    const percentChange = ((priceDifference / trade.entryPrice) * 100).toFixed(2);
                    
                    // Calculate live profit/loss based on trade direction
                    const assetRate = selectedAsset.rate;
                    let liveProfit = 0;
                    let isWinning = false;
                    
                    if (trade.type === "CALL") {
                      // CALL: betting price goes UP
                      if (priceUp) {
                        // Winning: price went up as expected
                        liveProfit = trade.amount * (assetRate / 100);
                        isWinning = true;
                      } else {
                        // Losing: price went down (opposite of prediction)
                        liveProfit = -trade.amount;
                        isWinning = false;
                      }
                    } else {
                      // PUT: betting price goes DOWN
                      if (!priceUp) {
                        // Winning: price went down as expected
                        liveProfit = trade.amount * (assetRate / 100);
                        isWinning = true;
                      } else {
                        // Losing: price went up (opposite of prediction)
                        liveProfit = -trade.amount;
                        isWinning = false;
                      }
                    }
                    
                    return (
                      <div key={trade.id} className={cn("border rounded p-3 transition-all", priceUp ? "border-chart-up/40 bg-chart-up/8" : "border-chart-down/40 bg-chart-down/8")}>
                        {/* Header with Direction Indicator */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{trade.type} {trade.asset}</span>
                            {/* Animated Direction Arrow */}
                            <div className={cn("flex items-center gap-1 px-2 py-1 rounded text-xs font-bold", priceUp ? "bg-chart-up/20 text-chart-up" : "bg-chart-down/20 text-chart-down")}>
                              {priceUp ? (
                                <>
                                  <ArrowUp className="w-3 h-3 animate-bounce" />
                                  RISING
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="w-3 h-3 animate-bounce" />
                                  FALLING
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-yellow-400 font-mono text-xs">${trade.amount}</span>
                        </div>

                        {/* Live Profit/Loss Display */}
                        <div className={cn("p-2 rounded mb-2 border-2 text-center font-bold", isWinning ? "bg-chart-up/20 border-chart-up/50 text-chart-up" : "bg-chart-down/20 border-chart-down/50 text-chart-down")}>
                          <div className="text-xs text-muted-foreground mb-1">Live {isWinning ? "Profit" : "Loss"}</div>
                          <div className="text-lg font-mono">
                            {isWinning ? "+" : ""}{liveProfit.toFixed(2)} $
                          </div>
                        </div>

                        {/* Price Section with Trend */}
                        <div className="space-y-1 text-xs mb-2">
                          <div className="flex justify-between items-center bg-background/50 rounded p-1.5">
                            <span className="text-muted-foreground">Entry:</span>
                            <span className="font-mono font-bold">${trade.entryPrice.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between items-center bg-background/50 rounded p-1.5 border-l-2" style={{borderColor: priceUp ? 'hsl(var(--chart-up))' : 'hsl(var(--chart-down))'}}>
                            <span className="text-muted-foreground">Current:</span>
                            <div className="flex items-center gap-1">
                              <span className={cn("font-mono font-bold", priceUp ? "text-chart-up" : "text-chart-down")}>
                                ${lastPrice.toFixed(4)}
                              </span>
                              <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", priceUp ? "bg-chart-up/20 text-chart-up" : "bg-chart-down/20 text-chart-down")}>
                                {priceUp ? "+" : ""}{percentChange}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Timer */}
                        <div className="flex justify-between font-bold text-xs mb-2">
                          <span>Time Left:</span>
                          <span className={cn("font-mono px-2 py-1 rounded", tr <= 5 ? "bg-chart-down/30 text-chart-down animate-pulse" : tr <= 15 ? "bg-yellow-500/30 text-yellow-400" : "bg-primary/20 text-primary")}>{tr}s</span>
                        </div>
                        
                        {/* Timer Progress Bar */}
                        <div className="w-full bg-secondary/30 rounded h-1.5 overflow-hidden mb-2">
                          <div 
                            className={cn("h-full transition-all", tr <= 5 ? "bg-gradient-to-r from-chart-down to-red-500" : tr <= 15 ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-primary to-accent")}
                            style={{ width: `${(tr / trade.timeFrame) * 100}%` }}
                          />
                        </div>

                        {/* Double Bet Button - Shows when 15s or less remaining */}
                        {tr <= 15 && tr > 0 && (
                          <Button
                            onClick={() => doubleBet(trade.id)}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 rounded text-xs"
                            data-testid={`button-double-bet-${trade.id}`}
                          >
                            🎲 Double Bet (${(trade.amount * 2).toFixed(2)})
                          </Button>
                        )}
                      </div>
                    );
                  })}
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
                    disabled={balance === 0}
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
                    disabled={balance === 0}
                    className="h-20 flex flex-col gap-1 bg-chart-up hover:bg-chart-up/90 text-white border-none disabled:opacity-50"
                  >
                    <ArrowUp className="w-6 h-6" />
                    <span className="font-bold">CALL</span>
                    <span className="text-xs">{selectedAsset.rate}%</span>
                  </Button>
                  <Button 
                    onClick={() => placeTrade("PUT")}
                    disabled={balance === 0}
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
