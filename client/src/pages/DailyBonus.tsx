import { useState, useEffect } from 'react';
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gem, Shield, Gift, CheckCircle } from 'lucide-react';

const getRewardIcon = (type: string) => {
  switch (type) {
    case 'gem':
      return <Gem className="w-8 h-8 text-red-400" />;
    case 'power-up':
      return <Shield className="w-8 h-8 text-cyan-400" />;
    case 'secret':
      return <Gift className="w-8 h-8 text-purple-400" />;
    default:
      return null;
  }
};

const WEEKS_REWARDS = [
  // Week 1
  [
    { day: 1, type: 'gem', amount: 1 },
    { day: 2, type: 'gem', amount: 1 },
    { day: 3, type: 'power-up', amount: 1 },
    { day: 4, type: 'gem', amount: 2 },
    { day: 5, type: 'gem', amount: 2 },
    { day: 6, type: 'power-up', amount: 1 },
    { day: 7, type: 'secret', amount: 1 },
  ],
  // Week 2
  [
    { day: 8, type: 'gem', amount: 1 },
    { day: 9, type: 'power-up', amount: 1 },
    { day: 10, type: 'power-up', amount: 1 },
    { day: 11, type: 'power-up', amount: 1 },
    { day: 12, type: 'gem', amount: 1 },
    { day: 13, type: 'gem', amount: 1 },
    { day: 14, type: 'secret', amount: 1 },
  ],
  // Weeks 3 & 4 can be defined here
];

export default function DailyBonus() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [loginStreak, setLoginStreak] = useState(8); // Example: user is on day 9
  const [lastClaimedDay, setLastClaimedDay] = useState(8);

  const canClaimToday = loginStreak > lastClaimedDay && loginStreak < 29;

  const handleClaim = () => {
    if (!canClaimToday) return;
    console.log(`Claimed prize for day ${loginStreak}`);
    setLastClaimedDay(loginStreak);
    // Here you would add the reward to the user's inventory or balance
  };

  const renderRewardGrid = (rewards: any[]) => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {rewards.map(reward => {
          const isToday = reward.day === loginStreak;
          const isClaimed = reward.day <= lastClaimedDay;
          const isFuture = reward.day > loginStreak;

          return (
            <Card key={reward.day} className={cn(
              "p-3 text-center flex flex-col items-center justify-between h-28",
              isToday && "bg-green-500/20 border-green-500 ring-2 ring-green-500",
              isClaimed && !isToday && "bg-slate-800/50 opacity-60",
              isFuture && "bg-slate-900/70 border-slate-700"
            )}>
              <div className="flex-1 flex flex-col items-center justify-center">
                {isClaimed && <CheckCircle className="w-8 h-8 text-green-400 absolute" />}
                {getRewardIcon(reward.type)}
                <p className={cn("font-bold mt-1", reward.type === 'secret' && "text-purple-300")}>
                  {reward.type === 'secret' ? "Secret gift" : `x ${reward.amount}`}
                </p>
              </div>
              <p className="text-xs text-slate-400 font-bold">
                {isToday ? "Today" : `Day ${reward.day}`}
              </p>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700 text-white p-0 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2">Daily bonus</h2>
          <p className="text-center text-slate-300 text-sm mb-4">
            Don't miss the opportunity and try to visit the platform as often as possible to receive the maximum number of the most valuable gifts.
          </p>
          <p className="text-center text-slate-300 text-sm font-semibold">Get bonuses every day!</p>
          <p className="text-center text-slate-400 text-xs">We highly value your loyalty!</p>
        </div>

        <div className="px-4 mb-4">
            <div className="flex justify-between bg-slate-800/50 p-1 rounded-lg">
                {[1, 2, 3, 4].map(week => (
                    <Button key={week} variant={activeWeek === week ? "default" : "ghost"} onClick={() => setActiveWeek(week)} className="flex-1 text-xs">
                        Week {week}
                    </Button>
                ))}
            </div>
        </div>

        <div className="p-4 bg-black/20 max-h-64 overflow-y-auto">
            {renderRewardGrid(WEEKS_REWARDS[activeWeek - 1] || [])}
        </div>

        <div className="p-4">
          <Button 
            onClick={handleClaim} 
            disabled={!canClaimToday} 
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-bold disabled:opacity-50">
            {canClaimToday ? "Claim today's prize" : (loginStreak > lastClaimedDay ? "No prize today" : "Already claimed")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
