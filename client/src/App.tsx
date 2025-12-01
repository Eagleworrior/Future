import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/Auth";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Trading from "@/pages/Trading";
import Setup from "@/pages/Setup";
import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";
import Referral from "@/pages/Referral";
import Leaderboard from "@/pages/Leaderboard";
import Badges from "@/pages/Badges";
import { Tournaments } from "@/pages/Tournaments";
import { EconomicCalendar } from "@/pages/EconomicCalendar";
import { RiskManagement } from "@/pages/RiskManagement";

function Router({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        <Route path="/*" component={Auth} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/setup" component={Setup} />
      <Route path="/trade" component={Trading} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/badges" component={Badges} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/referral" component={Referral} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/calendar" component={EconomicCalendar} />
      <Route path="/risk" component={RiskManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router isAuthenticated={isAuthenticated} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
