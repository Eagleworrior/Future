import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Star } from "lucide-react";

export default function TradeHistory() {
  const [activeTab, setActiveTab] = useState("closed");
  const [closedTrades, setClosedTrades] = useState<any>({});

  useEffect(() => {
    const savedTrades = localStorage.getItem('tradeHistory');
    if (savedTrades) {
      const trades = JSON.parse(savedTrades);
      const groupedTrades = trades.reduce((acc: any, trade: any) => {
          const date = new Date(trade.startTime).toISOString().split('T')[0];
          if (!acc[date]) {
              acc[date] = [];
          }
          acc[date].push(trade);
          return acc;
      }, {});
      setClosedTrades(groupedTrades);
    }
  }, []);

  const renderTradeItem = (trade: any) => {
    const isWin = trade.status === 'won';
    return (
      <div key={trade.id} className="p-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{trade.asset}</span>
            <span className="text-green-400">+{trade.payoutRate}%</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm">
            {isWin ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className="font-mono">${trade.amount.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs text-slate-400 mb-1">{trade.createdAt}</div>
          <div className={cn("font-mono font-bold text-lg", isWin ? "text-green-400" : "text-red-500")}>
            {isWin ? `+$${(trade.amount + trade.profit).toFixed(2)}` : '$0.00'}
          </div>
          {isWin && (
             <div className="text-xs text-green-500">{`+$${trade.profit.toFixed(2)}`}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Shell>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Trades</h1>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={activeTab === "opened" ? "default" : "outline"}
            onClick={() => setActiveTab("opened")}
          >
            Opened
          </Button>
          <Button
            variant={activeTab === "closed" ? "default" : "outline"}
            onClick={() => setActiveTab("closed")}
          >
            Closed
          </Button>
        </div>

        {activeTab === 'closed' && (
          <Card className="bg-slate-900/50 border-slate-800">
            {Object.keys(closedTrades).length > 0 ? (
                Object.entries(closedTrades).map(([date, trades]: [string, any]) => (
                  <div key={date}>
                    <div className="p-2 text-center text-xs font-semibold text-slate-400 bg-slate-800/50">
                      {date}
                    </div>
                    <div>{(trades as any[]).map(renderTradeItem)}</div>
                  </div>
                ))
            ) : (
                <div className="text-center py-10 text-slate-400">
                    <p>No closed trades yet.</p>
                </div>
            )}
          </Card>
        )}

        {activeTab === 'opened' && (
            <div className="text-center py-10 text-slate-400">
                <p>No open trades.</p>
            </div>
        )}
      </div>
    </Shell>
  );
}
