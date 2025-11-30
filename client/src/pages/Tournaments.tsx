import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, TrendingUp, Award } from "lucide-react";
import { useState } from "react";

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
}

export function Tournaments() {
  const [tournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "Daily Trading Challenge",
      prize: 5000,
      participants: 342,
      startTime: "Today 00:00 UTC",
      endTime: "Today 24:00 UTC",
      yourRank: 12,
      status: "live",
      entryFee: 0,
    },
    {
      id: 2,
      name: "Weekly Pro Battle",
      prize: 25000,
      participants: 856,
      startTime: "Next Monday",
      endTime: "Next Sunday",
      yourRank: 0,
      status: "upcoming",
      entryFee: 10,
    },
    {
      id: 3,
      name: "Monthly Grand Prix",
      prize: 100000,
      participants: 5234,
      startTime: "Dec 1",
      endTime: "Dec 31",
      yourRank: 45,
      status: "live",
      entryFee: 25,
    },
    {
      id: 4,
      name: "VIP Elite Tournament",
      prize: 50000,
      participants: 128,
      startTime: "Dec 15",
      endTime: "Dec 31",
      yourRank: 0,
      status: "upcoming",
      entryFee: 100,
    },
  ]);

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="title-gradient mb-2">🏆 Trading Tournaments</h1>
          <p className="text-muted-foreground">Compete with traders worldwide for massive prizes</p>
        </div>

        <div className="grid gap-4">
          {tournaments.map((t) => (
            <Card key={t.id} className="p-4 hover:border-primary/50 transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <Badge className={cn(
                      t.status === "live" ? "bg-green-500" : t.status === "upcoming" ? "bg-blue-500" : "bg-gray-500"
                    )}>
                      {t.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{t.startTime} → {t.endTime}</p>
                </div>
                <div className="text-right">
                  <div className="subtitle-gradient text-2xl font-bold">${t.prize.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-secondary/20 rounded">
                <div>
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="font-bold flex items-center gap-1"><Users className="w-4 h-4" /> {t.participants}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Rank</p>
                  <p className={cn("font-bold", t.yourRank === 0 ? "text-muted-foreground" : "text-chart-up")}>
                    {t.yourRank === 0 ? "Not entered" : `#${t.yourRank}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                  <p className="font-bold">${t.entryFee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Win Rate %</p>
                  <p className="font-bold text-chart-up">68%</p>
                </div>
              </div>

              <div className="flex gap-2">
                {t.status === "upcoming" && t.yourRank === 0 && (
                  <Button className="flex-1 button-gradient-primary">Join Tournament</Button>
                )}
                {t.status === "live" && (
                  <>
                    <Button variant="outline" className="flex-1">View Rules</Button>
                    <Button className="flex-1 button-gradient-success">View Leaderboard</Button>
                  </>
                )}
                {t.status === "ended" && (
                  <Button variant="outline" className="flex-1">View Results</Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-secondary/30 border-primary/30">
          <h3 className="font-bold mb-2">💡 Tournament Tips</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Free daily tournaments with no entry fee - perfect for practice</li>
            <li>• Win real prizes by reaching top positions</li>
            <li>• Entry fees go directly to prize pools (zero house cut)</li>
            <li>• Leaderboards reset hourly, daily, or monthly</li>
            <li>• Your rank updates in real-time</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
