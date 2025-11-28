import { addMinutes, format } from "date-fns";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  rsi?: number;
  ma20?: number;
  ma50?: number;
  bb_upper?: number;
  bb_lower?: number;
}

// Technical Indicators Calculation
export const calculateRSI = (prices: number[], period = 14): number => {
  if (prices.length < period) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += -diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateMA = (prices: number[], period: number): number => {
  if (prices.length < period) return prices[prices.length - 1];
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

export const calculateBollingerBands = (prices: number[], period = 20) => {
  if (prices.length < period) return { upper: 0, lower: 0 };
  const ma = calculateMA(prices, period);
  const variance = prices.slice(-period).reduce((sum, p) => sum + Math.pow(p - ma, 2), 0) / period;
  const std = Math.sqrt(variance);
  return { upper: ma + 2 * std, lower: ma - 2 * std, ma };
};

// Generate highly unpredictable candle data with technical indicators
export const generateData = (count: number): CandleData[] => {
  const data: CandleData[] = [];
  let currentPrice = 150.00;
  const now = new Date();
  let trend = Math.random() > 0.5 ? 1 : -1;
  const prices: number[] = [currentPrice];

  for (let i = count; i > 0; i--) {
    const time = format(addMinutes(now, -i), "HH:mm");
    
    const volatility = 0.3 + Math.random() * 0.7;
    const trendShift = Math.random() > 0.85 ? Math.random() - 0.5 : 0;
    trend += trendShift;
    trend = Math.max(-1, Math.min(1, trend));

    const change = trend * volatility + (Math.random() - 0.5) * volatility;
    const close = currentPrice + change;
    
    const open = currentPrice;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;

    prices.push(close);
    const rsi = calculateRSI(prices);
    const ma20 = calculateMA(prices, 20);
    const ma50 = calculateMA(prices, 50);
    const bb = calculateBollingerBands(prices, 20);

    data.push({
      time,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: Math.floor(Math.random() * 10000),
      rsi: parseFloat(rsi.toFixed(2)),
      ma20: parseFloat(ma20.toFixed(4)),
      ma50: parseFloat(ma50.toFixed(4)),
      bb_upper: parseFloat(bb.upper.toFixed(4)),
      bb_lower: parseFloat(bb.lower.toFixed(4)),
    });

    currentPrice = close;
  }
  return data;
};

export const INITIAL_BALANCE = 10000.00;

// COMPREHENSIVE TRADING ASSETS - All major markets
export const ASSETS = [
  // FOREX - Major Pairs
  { symbol: "EUR/USD", type: "Forex", rate: 85 },
  { symbol: "GBP/USD", type: "Forex", rate: 82 },
  { symbol: "USD/JPY", type: "Forex", rate: 78 },
  { symbol: "USD/CHF", type: "Forex", rate: 80 },
  { symbol: "AUD/USD", type: "Forex", rate: 72 },
  { symbol: "USD/CAD", type: "Forex", rate: 75 },
  { symbol: "NZD/USD", type: "Forex", rate: 68 },
  { symbol: "EUR/GBP", type: "Forex", rate: 70 },
  { symbol: "EUR/JPY", type: "Forex", rate: 76 },
  { symbol: "GBP/JPY", type: "Forex", rate: 74 },

  // CRYPTOCURRENCIES
  { symbol: "BTC/USD", type: "Crypto", rate: 75 },
  { symbol: "ETH/USD", type: "Crypto", rate: 70 },
  { symbol: "XRP/USD", type: "Crypto", rate: 65 },
  { symbol: "LTC/USD", type: "Crypto", rate: 62 },
  { symbol: "BCH/USD", type: "Crypto", rate: 68 },
  { symbol: "ADA/USD", type: "Crypto", rate: 60 },
  { symbol: "SOL/USD", type: "Crypto", rate: 72 },
  { symbol: "DOGE/USD", type: "Crypto", rate: 58 },

  // COMMODITIES
  { symbol: "Gold", type: "Commodity", rate: 80 },
  { symbol: "Silver", type: "Commodity", rate: 68 },
  { symbol: "Oil (WTI)", type: "Commodity", rate: 76 },
  { symbol: "Brent Oil", type: "Commodity", rate: 74 },
  { symbol: "Natural Gas", type: "Commodity", rate: 65 },
  { symbol: "Copper", type: "Commodity", rate: 70 },
  { symbol: "Platinum", type: "Commodity", rate: 72 },
  { symbol: "Palladium", type: "Commodity", rate: 75 },

  // STOCK INDICES
  { symbol: "S&P500", type: "Index", rate: 88 },
  { symbol: "NASDAQ100", type: "Index", rate: 85 },
  { symbol: "DAX", type: "Index", rate: 82 },
  { symbol: "FTSE100", type: "Index", rate: 80 },
  { symbol: "CAC40", type: "Index", rate: 78 },
  { symbol: "Nikkei225", type: "Index", rate: 76 },
  { symbol: "ASX200", type: "Index", rate: 74 },
  { symbol: "KOSPI", type: "Index", rate: 72 },

  // STOCKS - Popular companies
  { symbol: "APPLE", type: "Stock", rate: 85 },
  { symbol: "GOOGLE", type: "Stock", rate: 88 },
  { symbol: "TESLA", type: "Stock", rate: 92 },
  { symbol: "MICROSOFT", type: "Stock", rate: 87 },
  { symbol: "AMAZON", type: "Stock", rate: 86 },
  { symbol: "META", type: "Stock", rate: 80 },
  { symbol: "NVIDIA", type: "Stock", rate: 90 },
  { symbol: "AMD", type: "Stock", rate: 82 },
];

// ACCOUNT TYPES
export const ACCOUNT_TYPES = [
  { id: "micro", name: "Micro", minDeposit: 10, maxPayout: 90 },
  { id: "basic", name: "Basic", minDeposit: 50, maxPayout: 92 },
  { id: "silver", name: "Silver", minDeposit: 250, maxPayout: 93 },
  { id: "gold", name: "Gold", minDeposit: 1000, maxPayout: 94 },
  { id: "platinum", name: "Platinum", minDeposit: 5000, maxPayout: 95 },
  { id: "exclusive", name: "Exclusive", minDeposit: 10000, maxPayout: 95 },
];

// High accuracy signals (80%)
export const SIGNALS = [
  { asset: "EUR/USD", type: "CALL", confidence: 80, time: "1 min" },
  { asset: "Gold", type: "PUT", confidence: 80, time: "5 min" },
  { asset: "BTC/USD", type: "CALL", confidence: 80, time: "2 min" },
  { asset: "Oil (WTI)", type: "CALL", confidence: 80, time: "3 min" },
  { asset: "S&P500", type: "CALL", confidence: 80, time: "1 min" },
  { asset: "ETH/USD", type: "CALL", confidence: 80, time: "4 min" },
];

// Live trader data for leaderboard
export const TOP_TRADERS = [
  { id: 1, username: "ProTrader", winRate: 82, totalTrades: 1240, profit: 45230 },
  { id: 2, username: "MarketMaster", winRate: 79, totalTrades: 890, profit: 38450 },
  { id: 3, username: "SignalHunter", winRate: 81, totalTrades: 1120, profit: 42100 },
  { id: 4, username: "TrendFollower", winRate: 76, totalTrades: 950, profit: 32800 },
  { id: 5, username: "GoldenTouch", winRate: 80, totalTrades: 1050, profit: 41200 },
];
