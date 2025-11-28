# Expert Trade - Professional Trading Platform

## Overview

Expert Trade is a full-stack web-based trading platform that simulates commodities, crypto, and stocks trading. The application provides users with demo and real account types, real-time market data visualization, social trading features (leaderboards, copy trading), gamification elements (badges, loyalty points), and financial operations (deposits, withdrawals, referrals).

The platform is built as a modern single-page application with a React frontend and Express backend, designed for deployment on Replit with plans for mobile app conversion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Built on shadcn/ui components (Radix UI primitives) with Tailwind CSS for styling. The design system emphasizes a dark trading-focused theme with custom color variables for chart visualization (chart-up green, chart-down red, gold accents).

**State Management**: React Query (@tanstack/react-query) handles server state and API caching. Local state uses React hooks. User authentication state is persisted in localStorage.

**Routing**: Wouter provides client-side routing with protected routes based on authentication status.

**Data Visualization**: Recharts library renders candlestick charts, line charts, and technical indicators (RSI, Moving Averages, Bollinger Bands). Mock data generation simulates realistic market movements with unpredictable price action.

**Key Pages**:
- Trading: Main interface with live charts, order placement, position management
- Auth: Login/registration with localStorage-based authentication
- Deposit/Withdraw: Payment processing with NCBA M-Pesa integration
- Leaderboard: Top traders with copy trading functionality
- Badges: Gamification system with loyalty points and achievement tracking
- Referral: Invite system with earnings tracking

### Backend Architecture

**Framework**: Express.js with TypeScript in ESM mode.

**Data Storage**: Dual storage strategy implemented via the IStorage interface:
- **Development**: In-memory storage (MemStorage class) using Map data structures
- **Production**: PostgreSQL via Drizzle ORM with Neon serverless driver

**Database Schema** (shared/schema.ts):
- Users: Authentication, balances (demo/real), referral system, loyalty points, badges
- Trades: Position tracking, P&L calculation, account type separation
- Deposits: Transaction history with verification codes
- Withdrawals: Payout tracking with method selection

**API Design**: RESTful endpoints under `/api/*` namespace:
- `/api/auth/*`: User registration and retrieval
- `/api/trades`: Trade creation and history
- `/api/deposits`: Deposit creation and tracking
- `/api/withdrawals`: Withdrawal processing

**Session Management**: Intended to use connect-pg-simple for PostgreSQL session storage (dependency present but not fully implemented in current code).

### Development vs Production

**Development Mode** (server/index-dev.ts):
- Vite middleware integration for HMR
- HTML template injection with nonce-based CSR
- Replit-specific plugins (cartographer, dev banner)

**Production Mode** (server/index-prod.ts):
- Serves pre-built static assets from dist/public
- Single-page application fallback to index.html

**Build Process**:
- Client: Vite builds React app to dist/public
- Server: esbuild bundles Express server to dist/index.js

### External Dependencies

**Database**: Neon Postgres (serverless PostgreSQL) via @neondatabase/serverless driver. Connection configured through DATABASE_URL environment variable. Drizzle ORM provides type-safe database access with schema migrations.

**Payment Processing**: NCBA M-Pesa integration for deposits (mock implementation with transaction code verification). The system includes duplicate transaction prevention via localStorage-based ledger.

**UI Libraries**:
- Radix UI: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Recharts: Chart visualization
- date-fns: Date formatting and manipulation
- lucide-react: Icon system

**Validation**: Zod schemas with drizzle-zod integration for type-safe API validation and database operations.

**Development Tools**:
- Replit-specific: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- Custom vite-plugin-meta-images: Updates OpenGraph meta tags for Replit deployment URLs

**Fonts**: Google Fonts integration (Rajdhani for display, Roboto for body text) loaded via CDN.

**Mobile Conversion**: Documentation indicates planned conversion to Android AAB using Expo React Native with EAS Build service.