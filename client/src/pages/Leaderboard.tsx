import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TOP_TRADERS } from "@/lib/mockData";
import { Trophy, Users, TrendingUp, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Leaderboard() {
  const [copied, setCopied] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopyTrade = (traderId: number) => {
    setCopied(traderId);
    toast({ title: `Copying ${TOP_TRADERS.find(t => t.id === traderId)?.username}'s trades...` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Shell>
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-gold" />
            Top Traders
          </h1>
          <p className="text-muted-foreground">Follow and copy the best traders on our platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Traders</div>
                <div className="text-3xl font-bold">{TOP_TRADERS.length}+</div>
              </div>
              <Users className="w-8 h-8 text-primary opacity-30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-chart-up/10 to-accent/10 border-chart-up/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Avg Win Rate</div>
                <div className="text-3xl font-bold text-chart-up">{(TOP_TRADERS.reduce((a, t) => a + t.winRate, 0) / TOP_TRADERS.length).toFixed(1)}%</div>
              </div>
              <TrendingUp className="w-8 h-8 text-chart-up opacity-30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-gold/10 to-accent/10 border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Profit</div>
                <div className="text-3xl font-bold text-gold">${(TOP_TRADERS.reduce((a, t) => a + t.profit, 0) / 1000).toFixed(0)}K</div>
              </div>
              <Trophy className="w-8 h-8 text-gold opacity-30" />
            </div>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-accent/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">#</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Trader Name</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Win Rate</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Trades</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">Profit</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {TOP_TRADERS.map((trader, idx) => (
                  <tr key={trader.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4">
                      {idx === 0 ? (
                        <Badge className="bg-gold/20 text-gold">🥇</Badge>
                      ) : idx === 1 ? (
                        <Badge className="bg-gray-400/20 text-gray-300">🥈</Badge>
                      ) : idx === 2 ? (
                        <Badge className="bg-orange-500/20 text-orange-400">🥉</Badge>
                      ) : (
                        <span className="text-muted-foreground font-mono">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{trader.username}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge className="bg-chart-up/20 text-chart-up mx-auto">{trader.winRate}%</Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">{trader.totalTrades}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono font-bold text-chart-up">${trader.profit.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        size="sm"
                        variant={copied === trader.id ? "default" : "outline"}
                        onClick={() => handleCopyTrade(trader.id)}
                        className="gap-2"
                      >
                        <Copy className="w-3 h-3" />
                        {copied === trader.id ? "Copying..." : "Copy"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Social Features Info */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Copy Trading</h3>
              <p className="text-sm text-muted-foreground">Automatically copy trades from top performers. Your portfolio mirrors their positions in real-time.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Social Discussion</h3>
              <p className="text-sm text-muted-foreground">Join trading communities, share strategies, and discuss market movements with experienced traders worldwide.</p>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
