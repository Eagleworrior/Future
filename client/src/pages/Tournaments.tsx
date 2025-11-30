import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, TrendingUp, Award, Crown, Zap, Medal } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface Tournament {
  id: number;
  name: string;
  prize: number;
  participants: number;
  startTime: string;
  endTime: string;
  yourRank: number;
  status: "upcoming" | "live" | "ended";
  entryFee: number;
  description: string;
}

interface TournamentParticipant {
  rank: number;
  username: string;
  profit: number;
  profitPercent: number;
  tradeCount: number;
  badge?: string;
  isYou?: boolean;
}

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "⚡ Lightning Duel",
      prize: 5000,
      participants: 342,
      startTime: "Now",
      endTime: "1h 45m",
      yourRank: 12,
      status: "live",
      entryFee: 0,
      description: "30-minute ultra-fast trading with 5s-30s time frames",
    },
    {
      id: 2,
      name: "🔥 Daily Grind",
      prize: 15000,
      participants: 1256,
      startTime: "Now",
      endTime: "4h 20m",
      yourRank: 45,
      status: "live",
      entryFee: 0,
      description: "Full day trading competition with all time frames",
    },
    {
      id: 3,
      name: "💎 Weekly Championship",
      prize: 50000,
      participants: 856,
      startTime: "Monday 00:00",
      endTime: "Sunday 23:59",
      yourRank: 0,
      status: "upcoming",
      entryFee: 10,
      description: "7-day battle for the ultimate trading crown",
    },
    {
      id: 4,
      name: "👑 Monthly Grand Prix",
      prize: 250000,
      participants: 5234,
      startTime: "Dec 1 00:00",
      endTime: "Dec 31 23:59",
      yourRank: 123,
      status: "live",
      entryFee: 25,
      description: "Elite traders compete for massive monthly prizes",
    },
  ]);

  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [liveLeaderboard, setLiveLeaderboard] = useState<TournamentParticipant[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);

  // Generate live leaderboard data
  const generateLeaderboard = (tournamentId: number): TournamentParticipant[] => {
    const ranks: TournamentParticipant[] = [
      { rank: 1, username: "TradeMaster🔥", profit: 2450, profitPercent: 24.5, tradeCount: 28, badge: "👑" },
      { rank: 2, username: "CryptoKing💎", profit: 2180, profitPercent: 21.8, tradeCount: 35, badge: "🥈" },
      { rank: 3, username: "ForexWizard⚡", profit: 1890, profitPercent: 18.9, tradeCount: 22, badge: "🥉" },
      { rank: 4, username: "BullRun📈", profit: 1650, profitPercent: 16.5, tradeCount: 31, badge: "⭐" },
      { rank: 5, username: "VolumeHunter📊", profit: 1420, profitPercent: 14.2, tradeCount: 42, badge: "⭐" },
      { rank: 6, username: "SwingShark🦈", profit: 1250, profitPercent: 12.5, tradeCount: 19, badge: "🔥" },
      { rank: 7, username: "PatternPro🎯", profit: 980, profitPercent: 9.8, tradeCount: 26, badge: "🔥" },
      { rank: 8, username: "RiskManager🛡️", profit: 750, profitPercent: 7.5, tradeCount: 15, badge: "✨" },
      { rank: 9, username: "FastTrader⚙️", profit: 520, profitPercent: 5.2, tradeCount: 48, badge: "✨" },
      { rank: 10, username: "SureShot🎲", profit: 380, profitPercent: 3.8, tradeCount: 11, badge: "💫" },
      { rank: 12, username: "You (YourUsername)", profit: 1050, profitPercent: 10.5, tradeCount: 24, badge: "👤", isYou: true },
    ];
    return ranks;
  };

  // Generate performance chart data
  const generatePerformanceData = () => {
    const data = [];
    for (let i = 0; i <= 20; i++) {
      data.push({
        time: `${i * 5}m`,
        profit: Math.max(0, 500 + i * 100 + Math.random() * 300 - 150),
      });
    }
    return data;
  };

  useEffect(() => {
    if (selectedTournament) {
      setLiveLeaderboard(generateLeaderboard(selectedTournament));
      setPerformanceData(generatePerformanceData());
    }
  }, [selectedTournament]);

  // Simulate live leaderboard updates
  useEffect(() => {
    if (!showLeaderboard || !selectedTournament) return;

    const interval = setInterval(() => {
      setLiveLeaderboard(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        updated[randomIndex] = {
          ...updated[randomIndex],
          profit: updated[randomIndex].profit + (Math.random() > 0.5 ? Math.random() * 200 : -Math.random() * 100),
          profitPercent: updated[randomIndex].profit / 10000 * 100,
        };
        return updated.sort((a, b) => b.profit - a.profit).map((p, idx) => ({ ...p, rank: idx + 1 }));
      });

      setPerformanceData(prev => {
        if (prev.length > 20) prev = prev.slice(1);
        const lastProfit = prev[prev.length - 1]?.profit || 1000;
        return [...prev, {
          time: `${(prev.length) * 5}m`,
          profit: Math.max(0, lastProfit + (Math.random() > 0.5 ? Math.random() * 300 : -Math.random() * 150)),
        }];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [showLeaderboard, selectedTournament]);

  const handleJoinTournament = (tournamentId: number) => {
    setJoined(true);
    setSelectedTournament(tournamentId);
    setShowLeaderboard(true);
    setTimeout(() => setJoined(false), 2000);
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="title-gradient mb-2">🏆 Trading Tournaments</h1>
          <p className="text-muted-foreground">Compete with thousands of traders worldwide for massive prizes</p>
        </div>

        {/* Live Tournament Grid */}
        <div className="grid gap-4">
          {tournaments.map((t) => (
            <Card 
              key={t.id} 
              className={`p-4 hover:border-primary/50 transition cursor-pointer ${
                selectedTournament === t.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => {
                setSelectedTournament(t.id);
                setShowLeaderboard(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <Badge className={cn(
                      t.status === "live" ? "bg-green-500 animate-pulse" : t.status === "upcoming" ? "bg-blue-500" : "bg-gray-500"
                    )}>
                      {t.status === "live" ? "🔴 LIVE" : t.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{t.startTime} → {t.endTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="subtitle-gradient text-2xl font-bold">${t.prize.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4 p-3 bg-secondary/20 rounded">
                <div>
                  <p className="text-xs text-muted-foreground">Traders</p>
                  <p className="font-bold flex items-center gap-1"><Users className="w-4 h-4" /> {t.participants}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Rank</p>
                  <p className={cn("font-bold", t.yourRank === 0 ? "text-muted-foreground" : "text-chart-up")}>
                    {t.yourRank === 0 ? "—" : `#${t.yourRank}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entry</p>
                  <p className="font-bold">${t.entryFee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg P&L</p>
                  <p className="font-bold text-chart-up">+$1,245</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hot Traders</p>
                  <p className="font-bold text-yellow-500">🔥 {Math.floor(t.participants * 0.15)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {t.status === "upcoming" && t.yourRank === 0 && (
                  <Button 
                    className="flex-1 button-gradient-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinTournament(t.id);
                    }}
                  >
                    Join Now
                  </Button>
                )}
                {(t.status === "live" || (joined && selectedTournament === t.id)) && (
                  <>
                    <Button 
                      className="flex-1 button-gradient-success"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLeaderboard(!showLeaderboard);
                      }}
                    >
                      {showLeaderboard && selectedTournament === t.id ? "Hide Leaderboard" : "View Live Leaderboard"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTournament(t.id);
                      }}
                    >
                      Start Trading
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Live Leaderboard & Performance */}
        {showLeaderboard && selectedTournament && (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Leaderboard */}
            <Card className="lg:col-span-2 p-4 border-primary/30 bg-secondary/30">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-lg">Live Leaderboard</h3>
                <Badge className="ml-auto animate-pulse bg-green-500">Real-time</Badge>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {liveLeaderboard.map((participant, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded border transition",
                      participant.isYou 
                        ? "border-primary/50 bg-primary/10 font-bold" 
                        : "border-border/50 hover:bg-secondary/50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {participant.badge || participant.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{participant.username}</p>
                      <p className="text-xs text-muted-foreground">{participant.badge ? participant.badge + " " : ""}{participant.tradeCount} trades</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-chart-up">${participant.profit.toLocaleString()}</p>
                      <p className={cn("text-xs font-semibold", participant.profitPercent >= 0 ? "text-chart-up" : "text-chart-down")}>
                        {participant.profitPercent >= 0 ? "+" : ""}{participant.profitPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Chart */}
            <Card className="p-4 border-primary/30 bg-secondary/30">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Your P&L
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-up))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-up))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="profit" stroke="hsl(var(--chart-up))" fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">⚡ Why Tournaments?</h4>
                <p className="text-sm text-muted-foreground">Compete against real traders, win prizes, and build your reputation on our platform. Every tournament increases your chances of recognition.</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <div className="flex items-start gap-3">
              <Medal className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">🏅 Tournament Rules</h4>
                <p className="text-sm text-muted-foreground">Rankings update in real-time. Top 10 receive cash prizes. Entry fees go to prize pool (zero house cut). Deposits limited to account balance.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
