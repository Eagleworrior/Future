import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ASSETS, generateData } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { ComposedChart, Bar, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { useLocation } from "wouter";
import { Zap, TrendingUp, Settings, CheckCircle, ArrowRight, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Setup() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [useSignals, setUseSignals] = useState(false);
  const [data, setData] = useState(generateData(50));

  // Detect candlestick patterns
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
    
    // Hammer Pattern
    if (latest.close > latest.open && (latest.low < latest.open - (latest.close - latest.open) * 2)) {
      patterns.push({ name: "Hammer", confidence: 72, direction: "BULLISH", icon: "🔨" });
    }
    
    // Shooting Star
    if (latest.close < latest.open && (latest.high > latest.close + (latest.open - latest.close) * 2)) {
      patterns.push({ name: "Shooting Star", confidence: 72, direction: "BEARISH", icon: "⭐" });
    }
    
    // Doji
    if (Math.abs(latest.close - latest.open) < (latest.high - latest.low) * 0.1) {
      patterns.push({ name: "Doji", confidence: 65, direction: "BULLISH", icon: "十" });
    }
    
    // Double Bottom
    if (Math.abs(prev2.low - latest.low) < (latest.high - latest.low) * 0.05) {
      patterns.push({ name: "Double Bottom", confidence: 78, direction: "BULLISH", icon: "⛰️" });
    }
    
    // Double Top
    if (Math.abs(prev2.high - latest.high) < (latest.high - latest.low) * 0.05) {
      patterns.push({ name: "Double Top", confidence: 78, direction: "BEARISH", icon: "🏔️" });
    }
    
    return patterns;
  };

  const patterns = detectCandlestickPatterns(data);
  const lastPrice = data[data.length - 1].close;
  const priceChange = ((lastPrice - data[0].close) / data[0].close) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const lastCandle = newData[newData.length - 1];
        const change = (Math.random() - 0.5) * 100;
        const newPrice = Math.max(lastCandle.close + change, 10000);
        
        newData.push({
          time: `${newData.length}`,
          open: lastCandle.close,
          close: newPrice,
          high: Math.max(lastCandle.close, newPrice) + Math.random() * 50,
          low: Math.min(lastCandle.close, newPrice) - Math.random() * 50,
          volume: Math.random() * 1000,
          ma20: newPrice,
          ma50: newPrice,
          rsi: 50 + (Math.random() - 0.5) * 20,
          bb_upper: newPrice + 200,
          bb_lower: newPrice - 200,
        });
        
        if (newData.length > 50) newData.shift();
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleProceed = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save preferences and go to trading
      localStorage.setItem("tradingPrefs", JSON.stringify({
        useSignals,
        selectedAsset: selectedAsset.symbol,
      }));
      navigate("/trade");
    }
  };

  const skipSetup = () => {
    navigate("/");
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with progress */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="title-gradient">Welcome to Expert Trade! 🚀</h1>
            <span className="text-sm font-medium text-muted-foreground">Step {step}/3</span>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-secondary"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Candlestick Patterns */}
        {step === 1 && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Live Candlestick Patterns</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Our platform detects real-time candlestick patterns to help you make informed trades. Watch the live chart below:
              </p>

              {/* Live Chart */}
              <div className="bg-black p-4 rounded-lg mb-4" style={{ minHeight: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.15} />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value}
                    />
                    <Bar dataKey="volume" fill="hsl(var(--muted-foreground))" opacity={0.3} yAxisId="right" />
                    <Area type="monotone" dataKey="open" stroke="none" fill="none" />
                    {/* Candlestick rendering via line */}
                    <Line type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Detected Patterns */}
              {patterns.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {patterns.map((p, idx) => (
                    <div key={idx} className="p-2 bg-secondary/30 rounded border border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{p.name}</p>
                          <div className="flex items-center gap-1">
                            <Badge className={cn(
                              "text-xs",
                              p.direction === "BULLISH" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            )}>
                              {p.direction}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{p.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {patterns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Analyzing patterns...</p>
              )}
            </Card>

            <Button className="w-full button-gradient-primary" onClick={handleProceed}>
              Continue to Signals <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Trading Signals */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold">AI Trading Signals</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Enable AI-powered trading signals to get real-time recommendations with accuracy percentages. You can always override signals and trade manually.
              </p>

              {/* Signal Toggle Cards */}
              <div className="grid gap-3">
                <Card 
                  className={cn(
                    "p-4 cursor-pointer transition border-2",
                    !useSignals ? "border-primary bg-primary/10" : "border-border"
                  )}
                  onClick={() => setUseSignals(false)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      {!useSignals && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">Manual Trading</h3>
                      <p className="text-sm text-muted-foreground">Trade based on your own analysis and intuition</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className={cn(
                    "p-4 cursor-pointer transition border-2",
                    useSignals ? "border-primary bg-primary/10" : "border-border"
                  )}
                  onClick={() => setUseSignals(true)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      {useSignals && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">AI Signals + Manual Trading</h3>
                      <p className="text-sm text-muted-foreground">Get AI recommendations (75-85% accuracy) AND trade manually anytime</p>
                      <div className="mt-2 text-xs bg-green-500/10 text-green-400 p-2 rounded">
                        ✨ Recommended for beginners to learn from AI insights
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* AI Signals Preview */}
              {useSignals && (
                <div className="mt-6 p-4 bg-secondary/30 border border-primary/30 rounded-lg">
                  <h4 className="font-bold mb-3 text-sm">📊 Sample Signal Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/30 rounded">
                      <span>EUR/USD</span>
                      <Badge className="bg-green-500">BUY ▲ 82%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-500/10 border border-red-500/30 rounded">
                      <span>BTC/USD</span>
                      <Badge className="bg-red-500">SELL ▼ 78%</Badge>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 button-gradient-primary" onClick={handleProceed}>
                Choose Currency <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Trading Instrument */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Choose Trading Instrument</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Select from 50+ global trading assets across Forex, Crypto, Stocks, Commodities, and Indices.
              </p>

              {/* Asset Categories */}
              <div className="space-y-3">
                {['Forex', 'Crypto', 'Stock', 'Commodity', 'Index'].map(category => {
                  const assets = ASSETS.filter(a => a.type === category);
                  return assets.length > 0 ? (
                    <div key={category}>
                      <p className="text-xs font-bold text-muted-foreground mb-2">{category.toUpperCase()} ({assets.length})</p>
                      <div className="grid grid-cols-2 gap-2">
                        {assets.slice(0, 4).map(asset => (
                          <Card
                            key={asset.symbol}
                            className={cn(
                              "p-3 cursor-pointer transition border-2",
                              selectedAsset.symbol === asset.symbol 
                                ? "border-primary bg-primary/10" 
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-sm">{asset.symbol}</p>
                                <p className="text-xs text-muted-foreground">{asset.rate}% payout</p>
                              </div>
                              {selectedAsset.symbol === asset.symbol && (
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-secondary/30 border border-primary/30 rounded-lg">
                <h4 className="font-bold mb-3">✅ Your Setup Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trading Signals:</span>
                    <span className="font-bold">{useSignals ? "Enabled (75-85% accuracy)" : "Disabled (Manual only)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Asset:</span>
                    <span className="font-bold">{selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span className="font-bold">Demo ($1,000)</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 button-gradient-success" onClick={handleProceed}>
                Start Trading Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Skip Setup Button */}
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={skipSetup}>
          Skip Setup & Go to Dashboard
        </Button>
      </div>
    </Shell>
  );
}
