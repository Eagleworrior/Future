import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function RiskManagement() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    dailyLossLimit: 500,
    tradeRiskPercent: 2,
    stopLossPercent: 5,
    takeProfitPercent: 10,
    maxOpenTrades: 5,
    minWinRate: 50,
  });

  const [dailyStats] = useState({
    dayStart: new Date().toLocaleDateString(),
    dayLoss: -120,
    dayWins: 8,
    dayLosses: 3,
    winRate: 73,
    openTrades: 2,
  });

  const handleSaveSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    toast({ title: "✅ Setting updated", description: `${key} set to ${value}` });
  };

  const riskStatus = dailyStats.dayLoss > -settings.dailyLossLimit ? "safe" : "warning";

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="title-gradient mb-2">🛡️ Risk Management</h1>
          <p className="text-muted-foreground">Protect your account with smart limits</p>
        </div>

        {/* Daily Status */}
        <Card className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold mb-1">Today's Trading Status</h3>
              <p className="text-sm text-muted-foreground">{dailyStats.dayStart}</p>
            </div>
            <Badge className={riskStatus === "safe" ? "bg-green-500" : "bg-yellow-500"}>
              {riskStatus === "safe" ? "✅ Safe" : "⚠️ Warning"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Daily Loss</p>
              <p className="text-red-400 font-bold">${Math.abs(dailyStats.dayLoss)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Loss Limit</p>
              <p className="text-yellow-400 font-bold">${settings.dailyLossLimit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-chart-up font-bold">{dailyStats.winRate}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trades</p>
              <p className="font-bold">{dailyStats.dayWins}W / {dailyStats.dayLosses}L</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Open Orders</p>
              <p className="font-bold">{dailyStats.openTrades}/{settings.maxOpenTrades}</p>
            </div>
          </div>

          <div className="mt-3 h-2 bg-secondary/30 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-chart-up to-yellow-500"
              style={{ width: `${Math.min(Math.abs(dailyStats.dayLoss) / settings.dailyLossLimit * 100, 100)}%` }}
            />
          </div>
        </Card>

        {/* Risk Settings */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Daily Loss Limit */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold">Daily Loss Limit</h3>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Maximum loss per day (USD)</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.dailyLossLimit}
                  onChange={(e) => setSettings({ ...settings, dailyLossLimit: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <Button onClick={() => handleSaveSetting("Daily Loss Limit", settings.dailyLossLimit)}>Save</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">When reached: Trading disabled until next day</p>
          </Card>

          {/* Risk Per Trade */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold">Risk Per Trade</h3>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Max % of balance to risk per trade</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.tradeRiskPercent}
                  onChange={(e: any) => setSettings({ ...settings, tradeRiskPercent: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-secondary/30 rounded">%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">$1000 balance × 2% = Max $20 per trade</p>
          </Card>

          {/* Stop Loss */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <h3 className="font-bold">Stop Loss Level</h3>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Exit trade if loss reaches (% of bet)</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.stopLossPercent}
                  onChange={(e: any) => setSettings({ ...settings, stopLossPercent: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-secondary/30 rounded">%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Auto close at -{settings.stopLossPercent}% loss</p>
          </Card>

          {/* Take Profit */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-bold">Take Profit Target</h3>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Close profitable trade at (% gain)</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.takeProfitPercent}
                  onChange={(e: any) => setSettings({ ...settings, takeProfitPercent: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-secondary/30 rounded">%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Auto close at +{settings.takeProfitPercent}% profit</p>
          </Card>

          {/* Max Concurrent Trades */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold">Max Open Trades</h3>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Maximum simultaneous open trades</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.maxOpenTrades}
                  onChange={(e: any) => setSettings({ ...settings, maxOpenTrades: parseInt(e.target.value) })}
                  className="flex-1"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Prevents overexposure to market</p>
          </Card>

          {/* Min Win Rate */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-chart-up" />
              <h3 className="font-bold">Minimum Win Rate</h3>
            </div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Alert if win rate drops below</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.minWinRate}
                  onChange={(e: any) => setSettings({ ...settings, minWinRate: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-secondary/30 rounded">%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Get alert when winning trades {"<"} target</p>
          </Card>
        </div>

        {/* Best Practices */}
        <Card className="p-4 bg-secondary/30 border-primary/30">
          <h3 className="font-bold mb-3">📋 Risk Management Best Practices</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✅ Never risk more than 2% of balance per trade</li>
            <li>✅ Set daily loss limits to protect account</li>
            <li>✅ Use stop loss on every trade</li>
            <li>✅ Lock profits with take profit targets</li>
            <li>✅ Limit concurrent trades (max 3-5)</li>
            <li>✅ Monitor win rate - below 50% = adjust strategy</li>
            <li>✅ Take breaks after 3 consecutive losses</li>
            <li>✅ Keep trading journal for analysis</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}
