import { addMinutes, format } from "date-fns";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Generate realistic-looking random candle data
export const generateData = (count: number): CandleData[] => {
  const data: CandleData[] = [];
  let currentPrice = 150.00;
  const now = new Date();

  for (let i = count; i > 0; i--) {
    const time = format(addMinutes(now, -i), "HH:mm");
    const volatility = 0.5;
    
    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * (volatility / 2);
    const low = Math.min(open, close) - Math.random() * (volatility / 2);

    data.push({
      time,
      open,
      high,
      low,
      close
    });

    currentPrice = close;
  }
  return data;
};

export const INITIAL_BALANCE = 1000.00;

export const ASSETS = [
  { symbol: "EUR/USD", rate: 85 },
  { symbol: "GBP/USD", rate: 82 },
  { symbol: "BTC/USD", rate: 70 },
  { symbol: "Gold", rate: 80 },
];

export const SIGNALS = [
  { asset: "EUR/USD", type: "CALL", confidence: 20, time: "1 min" },
  { asset: "Gold", type: "PUT", confidence: 20, time: "5 min" },
  { asset: "BTC/USD", type: "CALL", confidence: 20, time: "2 min" },
];
