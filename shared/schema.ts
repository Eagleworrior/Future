import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  demoBalance: numeric("demo_balance", { precision: 10, scale: 2 }).default("1000"),
  realBalance: numeric("real_balance", { precision: 10, scale: 2 }).default("0"),
  currentAccountType: varchar("current_account_type", { length: 20 }).default("demo"),
  referralCode: varchar("referral_code", { length: 255 }).unique(),
  referredBy: varchar("referred_by", { length: 36 }),
  totalReferrals: integer("total_referrals").default(0),
  referralEarnings: numeric("referral_earnings", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Trades table
export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  asset: varchar("asset", { length: 50 }).notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  entryPrice: numeric("entry_price", { precision: 10, scale: 4 }),
  exitPrice: numeric("exit_price", { precision: 10, scale: 4 }),
  profit: numeric("profit", { precision: 10, scale: 2 }),
  profitPercent: numeric("profit_percent", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 20 }).default("open"),
  timeFrame: integer("time_frame"), // in seconds
  accountType: varchar("account_type", { length: 20 }).default("demo"),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  userId: true,
  asset: true,
  type: true,
  amount: true,
  timeFrame: true,
});

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;

// Deposits table
export const deposits = pgTable("deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  transactionCode: varchar("transaction_code", { length: 255 }),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDepositSchema = createInsertSchema(deposits).pick({
  userId: true,
  amount: true,
  transactionCode: true,
});

export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;

// Withdrawals table
export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  method: varchar("method", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).pick({
  userId: true,
  amount: true,
  method: true,
});

export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
