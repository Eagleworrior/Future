import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTradeSchema, insertDepositSchema, insertWithdrawalSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // User endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }
      const user = await storage.createUser(data);
      res.json({ id: user.id, username: user.username, balance: user.balance });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ id: user.id, username: user.username, balance: user.balance });
  });

  // Trade endpoints
  app.post("/api/trades", async (req, res) => {
    try {
      const data = insertTradeSchema.parse(req.body);
      const tradeAmount = parseFloat(data.amount.toString());
      
      // Get user and verify balance
      const user = await storage.getUser(data.userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      const userBalance = parseFloat(user.balance);
      if (tradeAmount > userBalance) {
        res.status(400).json({ error: "Insufficient balance" });
        return;
      }

      // Deduct amount from balance
      await storage.updateUserBalance(data.userId, -tradeAmount);
      
      // Create trade with 80% win probability
      const isWin = Math.random() < 0.80;
      const profit = isWin ? tradeAmount * 0.8 : -tradeAmount;
      
      // Return trade result
      const trade = await storage.createTrade(data);
      
      // Add profit to balance
      await storage.updateUserBalance(data.userId, profit);
      
      res.json({
        ...trade,
        result: { isWin, profit, finalBalance: (userBalance - tradeAmount + profit).toFixed(2) }
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid trade request" });
    }
  });

  app.get("/api/trades/:userId", async (req, res) => {
    const trades = await storage.getUserTrades(req.params.userId);
    res.json(trades);
  });

  // Deposit endpoints
  app.post("/api/deposits", async (req, res) => {
    try {
      const data = insertDepositSchema.parse(req.body);
      if (parseFloat(data.amount.toString()) < 50) {
        res.status(400).json({ error: "Minimum deposit is $50" });
        return;
      }
      
      // Add deposit amount to balance
      const user = await storage.getUser(data.userId);
      if (user) {
        await storage.updateUserBalance(data.userId, parseFloat(data.amount.toString()));
      }
      
      const deposit = await storage.createDeposit(data);
      res.json(deposit);
    } catch (error) {
      res.status(400).json({ error: "Invalid deposit request" });
    }
  });

  app.get("/api/deposits/:userId", async (req, res) => {
    const deposits = await storage.getUserDeposits(req.params.userId);
    res.json(deposits);
  });

  // Withdrawal endpoints
  app.post("/api/withdrawals", async (req, res) => {
    try {
      const data = insertWithdrawalSchema.parse(req.body);
      if (parseFloat(data.amount.toString()) < 100) {
        res.status(400).json({ error: "Minimum withdrawal is $100" });
        return;
      }
      
      // Verify user has sufficient balance
      const user = await storage.getUser(data.userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      const userBalance = parseFloat(user.balance);
      if (parseFloat(data.amount.toString()) > userBalance) {
        res.status(400).json({ error: "Insufficient balance" });
        return;
      }
      
      // Deduct from balance
      await storage.updateUserBalance(data.userId, -parseFloat(data.amount.toString()));
      
      const withdrawal = await storage.createWithdrawal(data);
      res.json(withdrawal);
    } catch (error) {
      res.status(400).json({ error: "Invalid withdrawal request" });
    }
  });

  app.get("/api/withdrawals/:userId", async (req, res) => {
    const withdrawals = await storage.getUserWithdrawals(req.params.userId);
    res.json(withdrawals);
  });

  const httpServer = createServer(app);
  return httpServer;
}
