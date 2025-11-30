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
  loyaltyPoints: integer("loyalty_points").default(0),
  isPremium: boolean("is_premium").default(false),
  lastLoginDate: timestamp("last_login_date"),
  consecutiveLogins: integer("consecutive_logins").default(0),
  badges: text("badges").default("[]"),
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
  timeFrame: integer("time_frame"),
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

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  prizePool: numeric("prize_pool", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("upcoming"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  entryFee: numeric("entry_fee", { precision: 10, scale: 2 }).default("0"),
  maxParticipants: integer("max_participants"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
  name: true,
  description: true,
  prizePool: true,
  startTime: true,
  endTime: true,
  entryFee: true,
  maxParticipants: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

// Tournament Participants table
export const tournamentParticipants = pgTable("tournament_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  profit: numeric("profit", { precision: 10, scale: 2 }).default("0"),
  profitPercent: numeric("profit_percent", { precision: 5, scale: 2 }).default("0"),
  tradeCount: integer("trade_count").default(0),
  winCount: integer("win_count").default(0),
  rank: integer("rank"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertTournamentParticipantSchema = createInsertSchema(tournamentParticipants).pick({
  tournamentId: true,
  userId: true,
});

export type InsertTournamentParticipant = z.infer<typeof insertTournamentParticipantSchema>;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
