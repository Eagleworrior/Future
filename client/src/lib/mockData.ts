import { addMinutes, format } from "date-fns";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Generate highly unpredictable candle data with market-like behavior
export const generateData = (count: number): CandleData[] => {
  const data: CandleData[] = [];
  let currentPrice = 150.00;
  const now = new Date();
  let trend = Math.random() > 0.5 ? 1 : -1;

  for (let i = count; i > 0; i--) {
    const time = format(addMinutes(now, -i), "HH:mm");
    
    // Higher volatility with random spikes
    const volatility = 0.3 + Math.random() * 0.7;
    const trendShift = Math.random() > 0.85 ? Math.random() - 0.5 : 0;
    trend += trendShift;
    trend = Math.max(-1, Math.min(1, trend)); // Clamp trend

    const change = trend * volatility + (Math.random() - 0.5) * volatility;
    const close = currentPrice + change;
    
    const open = currentPrice;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;

    data.push({
      time,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4))
    });

    currentPrice = close;
  }
  return data;
};

export const INITIAL_BALANCE = 1000.00;

// Global trading assets across all markets
export const ASSETS = [
  { symbol: "EUR/USD", rate: 85 },
  { symbol: "GBP/USD", rate: 82 },
  { symbol: "USD/JPY", rate: 78 },
  { symbol: "AUD/USD", rate: 72 },
  { symbol: "BTC/USD", rate: 75 },
  { symbol: "ETH/USD", rate: 70 },
  { symbol: "Gold", rate: 80 },
  { symbol: "Silver", rate: 68 },
  { symbol: "Oil", rate: 76 },
  { symbol: "Natural Gas", rate: 65 },
  { symbol: "S&P500", rate: 88 },
  { symbol: "NASDAQ", rate: 85 },
];

// High accuracy signals (80%)
export const SIGNALS = [
  { asset: "EUR/USD", type: "CALL", confidence: 80, time: "1 min" },
  { asset: "Gold", type: "PUT", confidence: 80, time: "5 min" },
  { asset: "BTC/USD", type: "CALL", confidence: 80, time: "2 min" },
  { asset: "Oil", type: "CALL", confidence: 80, time: "3 min" },
  { asset: "S&P500", type: "CALL", confidence: 80, time: "1 min" },
];
