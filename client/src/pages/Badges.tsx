import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Lock, Unlock, Star, Flame, Crown, Gift } from "lucide-react";
import { useState, useEffect } from "react";

interface BadgeInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredPoints: number;
  earned: boolean;
}

export default function Badges() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(850);
  const [isPremium, setIsPremium] = useState(false);
  const [badges, setBadges] = useState<BadgeInfo[]>([
    { id: "login_1", name: "First Login", icon: "🎯", description: "Login for the first time", requiredPoints: 0, earned: true },
    { id: "trader_5", name: "5 Trades", icon: "📊", description: "Complete 5 trades", requiredPoints: 100, earned: true },
    { id: "winner_10", name: "10 Wins", icon: "🏆", description: "Win 10 consecutive trades", requiredPoints: 250, earned: true },
    { id: "gold_digger", name: "Gold Rush", icon: "💰", description: "Deposit $100+", requiredPoints: 500, earned: true },
    { id: "streak_7", name: "7-Day Streak", icon: "🔥", description: "Login 7 consecutive days", requiredPoints: 1000, earned: false },
    { id: "elite_trader", name: "Elite Trader", icon: "👑", description: "Earn 5000+ loyalty points", requiredPoints: 5000, earned: false },
    { id: "premium_access", name: "Premium Elite", icon: "⭐", description: "Unlock exclusive features", requiredPoints: 5000, earned: false },
    { id: "legendary", name: "Legendary Trader", icon: "🌟", description: "Reach $10,000 profit", requiredPoints: 8000, earned: false },
  ]);

  const progressPercent = (loyaltyPoints / 5000) * 100;

  return (
    <Shell>
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-gold" />
            Loyalty & Badges
          </h1>
          <p className="text-muted-foreground">Unlock exclusive features and badges through daily engagement</p>
        </div>

        {/* Loyalty Progress */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-2 font-bold">LOYALTY POINTS</div>
                  <div className="text-5xl font-display font-bold text-gold">{loyaltyPoints}</div>
                  <div className="text-sm text-muted-foreground mt-1">/ 5,000 to Premium</div>
                </div>
                <Zap className="w-16 h-16 text-gold opacity-20" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Premium</span>
                  <span className="font-bold">{progressPercent.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              <div className="text-sm text-muted-foreground">
                Earn 20 points daily • Bonus points for trading • Referral rewards
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${isPremium ? 'bg-gradient-to-br from-gold/20 to-yellow-500/10 border-gold/30' : 'bg-accent/30'}`}>
            <div className="text-center space-y-4">
              <div>
                {isPremium ? (
                  <Unlock className="w-12 h-12 text-gold mx-auto mb-2" />
                ) : (
                  <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                )}
              </div>
              <div>
                <div className="font-bold text-lg">Premium Status</div>
                <div className={`text-sm ${isPremium ? 'text-gold' : 'text-muted-foreground'}`}>
                  {isPremium ? '✓ ACTIVE' : 'Locked'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Premium Features */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-bold">Premium Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${isPremium ? 'border-gold/30 bg-gold/5' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <Star className={`w-5 h-5 mt-1 ${isPremium ? 'text-gold' : 'text-muted-foreground'}`} />
                <div>
                  <div className="font-bold">Advanced Analytics</div>
                  <div className="text-sm text-muted-foreground">Real-time market insights and AI predictions</div>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${isPremium ? 'border-gold/30 bg-gold/5' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <Flame className={`w-5 h-5 mt-1 ${isPremium ? 'text-gold' : 'text-muted-foreground'}`} />
                <div>
                  <div className="font-bold">Trading Signals</div>
                  <div className="text-sm text-muted-foreground">90%+ accuracy AI-powered signals</div>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${isPremium ? 'border-gold/30 bg-gold/5' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <Gift className={`w-5 h-5 mt-1 ${isPremium ? 'text-gold' : 'text-muted-foreground'}`} />
                <div>
                  <div className="font-bold">Bonus Payouts</div>
                  <div className="text-sm text-muted-foreground">Up to 95% profit on winning trades</div>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${isPremium ? 'border-gold/30 bg-gold/5' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <Crown className={`w-5 h-5 mt-1 ${isPremium ? 'text-gold' : 'text-muted-foreground'}`} />
                <div>
                  <div className="font-bold">VIP Support</div>
                  <div className="text-sm text-muted-foreground">Priority 24/7 dedicated support</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Badges Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Achievement Badges</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`p-6 text-center transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-b from-primary/10 to-accent/10 border-primary/30 hover:shadow-lg hover:shadow-primary/20'
                    : 'bg-background/50 border-border/50'
                }`}
              >
                <div className="mb-3 text-5xl">{badge.icon}</div>
                <h3 className="font-bold mb-1">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                <Badge className={badge.earned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}>
                  {badge.requiredPoints > 0 ? `${badge.requiredPoints} pts` : 'Unlocked'}
                </Badge>
                {badge.earned && (
                  <div className="mt-3 text-xs text-chart-up font-bold">✓ EARNED</div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Login Info */}
        <Card className="mt-8 p-6 bg-blue-500/10 border-blue-500/30">
          <div className="flex gap-3">
            <div className="text-2xl">📅</div>
            <div>
              <h3 className="font-bold mb-2">Daily Login Rewards</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Earn 20 points every day you login</li>
                <li>✓ Bonus 5x points on day 7 consecutive logins</li>
                <li>✓ Bonus 10x points on day 30 milestone</li>
                <li>✓ Reach 5,000 points = Automatic Premium Upgrade!</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
