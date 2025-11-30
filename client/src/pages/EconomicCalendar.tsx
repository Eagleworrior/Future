import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown, Globe } from "lucide-react";
import { useState } from "react";

interface EconomicEvent {
  id: number;
  country: string;
  event: string;
  time: string;
  impact: "high" | "medium" | "low";
  forecast: string;
  previous: string;
  actual?: string;
  affectedAssets: string[];
}

export function EconomicCalendar() {
  const [events] = useState<EconomicEvent[]>([
    {
      id: 1,
      country: "🇺🇸 USA",
      event: "Non-Farm Payroll",
      time: "Today 13:30 UTC",
      impact: "high",
      forecast: "227K",
      previous: "216K",
      actual: "225K",
      affectedAssets: ["EUR/USD", "GBP/USD", "USD/JPY", "S&P 500"],
    },
    {
      id: 2,
      country: "🇪🇺 EU",
      event: "ECB Interest Rate Decision",
      time: "Today 13:00 UTC",
      impact: "high",
      forecast: "4.25%",
      previous: "4.25%",
      affectedAssets: ["EUR/USD", "DAX 40", "Gold"],
    },
    {
      id: 3,
      country: "🇬🇧 UK",
      event: "Retail Sales YoY",
      time: "Today 09:00 UTC",
      impact: "medium",
      forecast: "2.1%",
      previous: "1.5%",
      affectedAssets: ["GBP/USD", "FTSE 100"],
    },
    {
      id: 4,
      country: "🇯🇵 Japan",
      event: "Manufacturing PMI",
      time: "Tomorrow 01:30 UTC",
      impact: "medium",
      forecast: "48.2",
      previous: "47.8",
      affectedAssets: ["USD/JPY", "Nikkei 225"],
    },
    {
      id: 5,
      country: "🇨🇭 Switzerland",
      event: "SNB Interest Rate",
      time: "Tomorrow 09:15 UTC",
      impact: "high",
      forecast: "1.75%",
      previous: "1.75%",
      affectedAssets: ["USD/CHF", "Gold"],
    },
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="title-gradient mb-2">📅 Economic Calendar</h1>
          <p className="text-muted-foreground">Live economic events affecting markets</p>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="p-4 hover:border-primary/50 transition">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{event.country.split(" ")[0]}</span>
                    <div>
                      <h3 className="font-bold">{event.event}</h3>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {event.affectedAssets.map((asset) => (
                      <Badge key={asset} variant="outline" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <Badge className={`mb-2 block ${getImpactColor(event.impact)}`}>
                    {event.impact === "high" && <AlertCircle className="w-4 h-4 inline mr-1" />}
                    {event.impact.toUpperCase()} IMPACT
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-secondary/20 rounded text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Forecast</p>
                  <p className="font-bold text-blue-400">{event.forecast}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Previous</p>
                  <p className="font-bold text-yellow-400">{event.previous}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actual</p>
                  <p className={`font-bold ${event.actual ? (parseFloat(event.actual) > parseFloat(event.forecast) ? "text-chart-up" : "text-chart-down") : "text-muted-foreground"}`}>
                    {event.actual || "Pending"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-secondary/30 border-primary/30">
          <h3 className="font-bold mb-2">💡 Calendar Tips</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• 🔴 High Impact events cause largest price movements</li>
            <li>• Actual vs Forecast: Better/worse than expected = volatility</li>
            <li>• Affected Assets show which instruments move the most</li>
            <li>• Red events: Avoid trading 5 mins before, huge spreads & gaps</li>
            <li>• Good for predicting direction: Positive data = currency UP</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}
