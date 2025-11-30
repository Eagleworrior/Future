import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, ComposedChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Zap, Trophy, Target, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface TradePattern {
  name: string;
  count: number;
  winRate: number;
  icon: string;
  direction: "BULLISH" | "BEARISH";
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [tradeStats] = useState({
    totalTrades: 287,
    wins: 198,
    losses: 89,
    winRate: 69,
    todayPnL: 2450,
    weekPnL: 12800,
    monthPnL: 45200,
    accountBalance: 51250.50,
  });

  const [patterns] = useState<TradePattern[]>([
    { name: "Bullish Engulfing", count: 45, winRate: 82, icon: "📈", direction: "BULLISH" },
    { name: "Hammer", count: 38, winRate: 78, icon: "🔨", direction: "BULLISH" },
    { name: "Double Bottom", count: 32, winRate: 75, icon: "⛰️", direction: "BULLISH" },
    { name: "Bearish Engulfing", count: 42, winRate: 79, icon: "📉", direction: "BEARISH" },
    { name: "Shooting Star", count: 35, winRate: 76, icon: "⭐", direction: "BEARISH" },
    { name: "Doji", count: 28, winRate: 68, icon: "十", direction: "BULLISH" },
  ]);

  const [performanceData] = useState([
    { date: "Mon", wins: 24, losses: 8 },
    { date: "Tue", wins: 28, losses: 5 },
    { date: "Wed", wins: 31, losses: 7 },
    { date: "Thu", wins: 26, losses: 9 },
    { date: "Fri", wins: 33, losses: 6 },
    { date: "Sat", images: 29, losses: 7 },
    { date: "Sun", wins: 27, losses: 8 },
  ]);

  const [pnlData] = useState([
    { time: "08:00", pnl: 250 },
    { time: "10:00", pnl: 580 },
    { time: "12:00", pnl: 1200 },
    { time: "14:00", pnl: 1850 },
    { time: "16:00", pnl: 2150 },
    { time: "18:00", pnl: 2450 },
  ]);

  const patternDistribution = [
    { name: "Engulfing", value: 87, color: "#4ade80" },
    { name: "Hammer/Star", value: 73, color: "#fbbf24" },
    { name: "Double/Triple", value: 60, color: "#60a5fa" },
    { name: "Doji/Candle", value: 67, color: "#c084fc" },
  ];

  return (
    <Shell>
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-sm border-b border-slate-700/40">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
              📊 Trade Performance Dashboard
            </h1>
            <Button onClick={() => navigate("/trade")} className="button-gradient-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Start Trading <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-slate-400">Live trading performance, pattern analysis & real-time metrics</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Win Rate</p>
                  <p className="text-3xl font-bold text-green-400">{tradeStats.winRate}%</p>
                  <p className="text-xs text-slate-500 mt-1">{tradeStats.wins}W / {tradeStats.losses}L</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Today P&L</p>
                  <p className="text-3xl font-bold text-blue-400">${tradeStats.todayPnL.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">+2.45%</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Trades</p>
                  <p className="text-3xl font-bold text-purple-400">{tradeStats.totalTrades}</p>
                  <p className="text-xs text-slate-500 mt-1">This month</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Account Balance</p>
                  <p className="text-3xl font-bold text-yellow-400">${tradeStats.accountBalance.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">+45.2% month</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/20">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Real-time P&L Chart */}
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Today's P&L Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={pnlData}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(148,163,184,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(148,163,184,0.5)" fontSize={12} />
                  <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #475569'}} />
                  <Area type="monotone" dataKey="pnl" stroke="#4ade80" fill="url(#colorPnl)" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            {/* Weekly Performance */}
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Weekly Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(148,163,184,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(148,163,184,0.5)" fontSize={12} />
                  <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #475569'}} />
                  <Bar dataKey="wins" stackId="a" fill="#4ade80" />
                  <Bar dataKey="losses" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Patterns & Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Patterns */}
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                🎯 Top Trading Patterns
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {patterns.map((pattern, idx) => (
                  <div key={idx} className={cn("p-3 rounded-lg border flex items-center justify-between", pattern.direction === "BULLISH" ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10")}>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{pattern.icon}</span>
                      <div>
                        <p className="font-bold text-sm text-white">{pattern.name}</p>
                        <p className="text-xs text-slate-400">{pattern.count} trades</p>
                      </div>
                    </div>
                    <Badge className={cn("font-bold", pattern.winRate >= 80 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400")}>
                      {pattern.winRate}% 📈
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pattern Distribution */}
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                📊 Pattern Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patternDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name} (${value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patternDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <p className="text-slate-400 text-xs mb-1">Weekly P&L</p>
              <p className="text-2xl font-bold text-green-400">${tradeStats.weekPnL.toLocaleString()}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <p className="text-slate-400 text-xs mb-1">Monthly P&L</p>
              <p className="text-2xl font-bold text-blue-400">${tradeStats.monthPnL.toLocaleString()}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/40">
              <p className="text-slate-400 text-xs mb-1">Avg Trade Size</p>
              <p className="text-2xl font-bold text-yellow-400">${(tradeStats.monthPnL / tradeStats.totalTrades).toFixed(0)}</p>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
