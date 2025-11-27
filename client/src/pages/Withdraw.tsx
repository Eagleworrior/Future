import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Withdraw() {
  const [amount, setAmount] = useState("100");
  const [method, setMethod] = useState<"bank" | "mobile" | "paypal" | null>(null);
  const [balance, setBalance] = useState(1240.50);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }

    if (withdrawAmount < 100) {
      toast({ title: "Minimum withdrawal is $100", variant: "destructive" });
      return;
    }

    if (withdrawAmount > balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }

    if (!method) {
      toast({ title: "Please select a withdrawal method", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Deduct from balance
      const newBalance = balance - withdrawAmount;
      setBalance(newBalance);
      setSuccess(true);

      // Show success toast
      const methodNames = {
        bank: "Bank Transfer",
        mobile: "Mobile Money",
        paypal: "PayPal"
      };

      toast({
        title: "Withdrawal Initiated! ✓",
        description: `$${withdrawAmount.toFixed(2)} withdrawal to ${methodNames[method]} has been initiated. Processing...`,
      });

      // Reset form after delay
      setTimeout(() => {
        setAmount("100");
        setMethod(null);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      toast({ title: "Withdrawal failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const methodOptions = [
    { id: "bank", label: "Bank Transfer", icon: "🏦" },
    { id: "mobile", label: "Mobile Money", icon: "📱" },
    { id: "paypal", label: "PayPal", icon: "₽" },
  ];

  return (
    <Shell>
      <div className="container max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Withdraw Funds</h1>
          <p className="text-muted-foreground">Select your withdrawal method and amount</p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-chart-up/10 border border-chart-up/30 flex items-center gap-3">
            <Check className="w-5 h-5 text-chart-up flex-shrink-0" />
            <div>
              <p className="font-bold text-chart-up">Withdrawal Processing</p>
              <p className="text-sm text-chart-up/80">Your funds will be transferred shortly</p>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {/* Current Balance */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
              <div className="text-4xl font-display font-bold text-gold">${balance.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-destructive" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>Minimum withdrawal amount is $100</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Withdrawal Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Withdrawal Amount ($)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100" 
                    min="100"
                    className="text-lg h-12 pr-12"
                  />
                  <div className="absolute right-4 top-3 text-muted-foreground text-sm font-mono">
                    USD
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: ${balance.toFixed(2)} • Min: $100
                </p>
              </div>

              {/* Withdrawal Method */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Withdrawal Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  {methodOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setMethod(option.id as "bank" | "mobile" | "paypal")}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-center",
                        method === option.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-card"
                      )}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Withdrawal Details */}
              {method && (
                <div className="p-4 rounded-lg bg-accent/50 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Withdrawal Amount</span>
                    <span className="font-mono font-bold">${parseFloat(amount || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-mono text-chart-down">$0.00</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="text-sm font-medium">You'll Receive</span>
                    <span className="font-mono font-bold text-chart-up">${parseFloat(amount || "0").toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Withdraw Button */}
              <Button 
                onClick={handleWithdraw}
                disabled={loading || !method}
                className="w-full h-12 text-lg font-bold bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Confirm Withdrawal"
                )}
              </Button>

              {/* Info */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-500/80">
                  Withdrawals are processed within 1-2 business days. The funds will be sent to your selected method.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
