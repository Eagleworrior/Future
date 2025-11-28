import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, Users, TrendingUp, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: TrendingUp, label: "Trade", href: "/" },
    { icon: Users, label: "Leaderboard", href: "/leaderboard" },
    { icon: Wallet, label: "Deposit", href: "/deposit" },
    { icon: LogOut, label: "Withdraw", href: "/withdraw" },
    { icon: Users, label: "Referral", href: "/referral" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-wider text-primary">
            <TrendingUp className="w-8 h-8" />
            EXPERT<span className="text-white">TRADE</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  location === item.href 
                    ? "bg-primary/10 text-primary border-l-4 border-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn("w-5 h-5", location === item.href && "text-primary")} />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Balance</div>
            <div className="text-xl font-display font-bold text-gold">$1,240.50</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border flex items-center px-4 justify-between bg-card">
          <div className="font-display font-bold text-xl text-primary">EXPERT<span className="text-white">TRADE</span></div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto bg-background relative">
          {children}
        </div>
      </main>
    </div>
  );
}
