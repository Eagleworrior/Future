import { type User, type InsertUser, type Trade, type InsertTrade, type Deposit, type InsertDeposit, type Withdrawal, type InsertWithdrawal } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: string, amount: number): Promise<void>;
  
  // Trade operations
  createTrade(trade: InsertTrade): Promise<Trade>;
  getUserTrades(userId: string): Promise<Trade[]>;
  
  // Deposit operations
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  getUserDeposits(userId: string): Promise<Deposit[]>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getUserWithdrawals(userId: string): Promise<Withdrawal[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private trades: Map<string, Trade>;
  private deposits: Map<string, Deposit>;
  private withdrawals: Map<string, Withdrawal>;

  constructor() {
    this.users = new Map();
    this.trades = new Map();
    this.deposits = new Map();
    this.withdrawals = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const referralCode = `REF${randomUUID().substring(0, 8).toUpperCase()}`;
    const user: User = {
      ...insertUser,
      id,
      demoBalance: "1000",
      realBalance: "0",
      currentAccountType: "demo",
      referralCode,
      referredBy: null,
      totalReferrals: 0,
      referralEarnings: "0",
      loyaltyPoints: 0,
      isPremium: false,
      lastLoginDate: new Date(),
      consecutiveLogins: 1,
      badges: "[]",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: string, amount: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      const currentBalance = parseFloat(user.demoBalance || "0");
      const newBalance = currentBalance + amount;
      user.demoBalance = newBalance.toFixed(2);
      this.users.set(userId, user);
    }
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = {
      ...insertTrade,
      id,
      profit: null,
      status: "open",
      createdAt: new Date(),
      closedAt: null,
    };
    this.trades.set(id, trade);
    return trade;
  }

  async getUserTrades(userId: string): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(t => t.userId === userId);
  }

  async createDeposit(insertDeposit: InsertDeposit): Promise<Deposit> {
    const id = randomUUID();
    const deposit: Deposit = {
      ...insertDeposit,
      id,
      status: "pending",
      verified: false,
      verifiedAt: null,
      createdAt: new Date(),
    };
    this.deposits.set(id, deposit);
    return deposit;
  }

  async getUserDeposits(userId: string): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(d => d.userId === userId);
  }

  async createWithdrawal(insertWithdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const id = randomUUID();
    const withdrawal: Withdrawal = {
      ...insertWithdrawal,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }

  async getUserWithdrawals(userId: string): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values()).filter(w => w.userId === userId);
  }
}

export const storage = new MemStorage();
