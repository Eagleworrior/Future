import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/Auth";
import Trading from "@/pages/Trading";
import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";
import Referral from "@/pages/Referral";
import Leaderboard from "@/pages/Leaderboard";
import Badges from "@/pages/Badges";

function Router({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/*" component={Auth} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Trading} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/badges" component={Badges} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/referral" component={Referral} />
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
