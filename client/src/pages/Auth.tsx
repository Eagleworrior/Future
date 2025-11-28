import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Mail, Lock, User, ArrowRight, Zap } from "lucide-react";

export default function Auth() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        if (!formData.username || !formData.password) {
          toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
          setLoading(false);
          return;
        }
        localStorage.setItem("user", JSON.stringify({
          id: "user_123",
          username: formData.username,
          email: formData.email || `${formData.username}@expert.trade`,
          demoBalance: 1000,
          realBalance: 0,
          isPremium: false,
          loyaltyPoints: 0
        }));
        toast({ title: "Success", description: "Welcome back to ExpertTrade!" });
      } else {
        // Signup logic
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
          setLoading(false);
          return;
        }
        localStorage.setItem("user", JSON.stringify({
          id: "user_" + Date.now(),
          username: formData.username,
          email: formData.email,
          demoBalance: 1000,
          realBalance: 0,
          isPremium: false,
          loyaltyPoints: 20
        }));
        toast({ title: "Success", description: "Account created! Welcome to ExpertTrade!" });
      }
      
      setTimeout(() => navigate("/"), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-10 h-10 text-gold" />
            <span className="text-3xl font-display font-bold">EXPERT<span className="text-white">TRADE</span></span>
          </div>
          <p className="text-muted-foreground">Professional Binary Options Trading Platform</p>
        </div>

        {/* Card */}
        <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-secondary/30 p-1 rounded-lg">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  isLogin
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  !isLogin
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="your_username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-secondary/50 border-border/50"
                  data-testid="input-username"
                />
              </div>

              {/* Email (only for signup) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-secondary/50 border-border/50"
                    data-testid="input-email"
                  />
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-secondary/50 border-border/50"
                  data-testid="input-password"
                />
              </div>

              {/* Confirm Password (only for signup) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-secondary/50 border-border/50"
                    data-testid="input-confirm-password"
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-bold py-3 text-base mt-6"
                data-testid="button-submit"
              >
                {loading ? "Processing..." : isLogin ? "Login to Trade" : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Benefits */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>$1,000 demo account to practice</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>40+ trading instruments live</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>Earn 20 points daily for premium</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 ExpertTrade. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
