import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Copy, Check, AlertCircle, Zap, TrendingUp, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Deposit() {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("100");
  const [transactionCode, setTransactionCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("safaricom");
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "✓ Copied to clipboard" });
  };

  const verifyDeposit = async () => {
    if (!transactionCode || transactionCode.trim() === "") {
      toast({ title: "Error: No transaction code", description: "Please enter your Safaricom transaction code", variant: "destructive" });
      return;
    }

    if (transactionCode.length < 10) {
      toast({ title: "Invalid code", description: "Transaction code must be at least 10 characters", variant: "destructive" });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < 10) {
      toast({ title: "Invalid amount", description: "Minimum deposit is $10", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
        const response = await fetch('/api/verify-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactionCode }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Verification failed');
        }

        // Assuming successful verification, update the balance
        const currentBalance = parseFloat(localStorage.getItem('realBalance') || '0');
        const newBalance = currentBalance + depositAmount;
        localStorage.setItem('realBalance', newBalance.toString());

        setVerified(true);
        toast({
            title: "✓ Deposit Verified & Credited!",
            description: `$${depositAmount.toFixed(2)} has been received and added to your account`,
        });

        setTimeout(() => {
            setAmount("100");
            setTransactionCode("");
            setVerified(false);
        }, 3000);

    } catch (error: any) {
        toast({
            title: "Verification Failed",
            description: error.message || "An unknown error occurred.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "safaricom",
      name: "Safaricom M-Pesa",
      icon: "🏦",
      description: "Secure mobile payment via Safaricom",
      fees: "0%",
      time: "Instant",
      color: "from-green-600 to-green-400",
      borderColor: "border-green-500/50",
      bgColor: "bg-green-500/10",
    },
    {
      id: "credit",
      name: "Credit Card",
      icon: "💳",
      description: "Visa, Mastercard, Amex",
      fees: "2.9%",
      time: "Instant",
      color: "from-purple-600 to-purple-400",
      borderColor: "border-purple-500/50",
      bgColor: "bg-purple-500/10",
      disabled: true,
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: "₿",
      description: "BTC, ETH, USDT transfers",
      fees: "1%",
      time: "5-30 mins",
      color: "from-orange-600 to-orange-400",
      borderColor: "border-orange-500/50",
      bgColor: "bg-orange-500/10",
      disabled: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "🅿️",
      description: "Quick PayPal transfers",
      fees: "3.5%",
      time: "1-2 hours",
      color: "from-yellow-600 to-yellow-400",
      borderColor: "border-yellow-500/50",
      bgColor: "bg-yellow-500/10",
      disabled: true,
    },
  ];

  const depositPlan = [
    { step: 1, title: "Choose Amount", description: "Select how much you want to deposit (Min: $10)", icon: "💰" },
    { step: 2, title: "Select Payment Method", description: "Pick your preferred deposit method", icon: "🎯" },
    { step: 3, title: "Complete Payment", description: "Transfer funds to our secure account", icon: "✅" },
    { step: 4, title: "Verify & Credit", description: "Funds verified and added to your account", icon: "🎉" },
  ];

  return (
    <Shell>
      <div className="w-full space-y-8 pb-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-green-900/50 to-slate-900 border border-green-500/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-small-white/[0.03] opacity-100"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Add Funds</span>
                </h1>
                <p className="text-lg text-slate-300 mb-4">Start trading with real money and unlock premium features</p>
              </div>
              <div className="text-6xl md:text-7xl">💳</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1">✓ Secure & Verified</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1">⚡ Instant Processing</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1">🛡️ Bank-Level Security</Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-green-500/30 bg-green-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-300">Instant</span>
            </div>
            <p className="text-sm text-muted-foreground">Funds credited instantly</p>
          </Card>
          <Card className="p-4 border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-300">No Fees</span>
            </div>
            <p className="text-sm text-muted-foreground">Zero hidden charges</p>
          </Card>
          <Card className="p-4 border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300">Secure</span>
            </div>
            <p className="text-sm text-muted-foreground">Bank-level encryption</p>
          </Card>
          <Card className="p-4 border-orange-500/30 bg-orange-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-300">Min $10</span>
            </div>
            <p className="text-sm text-muted-foreground">Low minimum deposit</p>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose Payment Method</h2>
            <p className="text-muted-foreground">Select your preferred way to deposit funds</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={cn(
                  "p-5 cursor-pointer transition-all border-2 relative overflow-hidden group",
                  selectedMethod === method.id && !method.disabled
                    ? `border-primary bg-primary/10 ring-2 ring-primary/50 shadow-lg shadow-primary/20`
                    : `${method.borderColor} ${method.bgColor} hover:border-opacity-100`,
                  method.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !method.disabled && setSelectedMethod(method.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" style={{backgroundImage: `linear-gradient(to right, var(--color-from), var(--color-to))`}}></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{method.icon}</div>
                    {selectedMethod === method.id && !method.disabled && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {method.disabled && (
                      <Badge className="bg-slate-500/20 text-slate-300">Coming Soon</Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{method.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{method.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fee: <span className="font-bold text-foreground">{method.fees}</span></span>
                    <span className="text-muted-foreground">Time: <span className="font-bold text-foreground">{method.time}</span></span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Deposit Form */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Deposit Details</h2>
              <p className="text-muted-foreground">Enter your deposit amount and payment information</p>
            </div>

            {verified && (
              <div className="p-4 rounded-lg bg-chart-up/10 border-2 border-chart-up/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <Check className="w-6 h-6 text-chart-up flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-chart-up text-lg">✓ Verified & Credited!</p>
                  <p className="text-sm text-chart-up/80">Your deposit of ${amount} has been successfully verified with Safaricom and added to your real trading account.</p>
                </div>
              </div>
            )}

            {/* Amount Selection */}
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <Label className="text-base font-bold mb-2 block">Deposit Amount</Label>
                  <p className="text-xs text-muted-foreground">Min: $10 • Max: $50,000</p>
                </div>
                <Badge className="bg-primary/20 text-primary">USD</Badge>
              </div>
              <div className="relative">
                <Input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100" 
                  min="10"
                  max="50000"
                  className="text-2xl h-14 pr-16 font-mono font-bold border-2 border-primary/30 bg-background/50 focus:border-primary"
                  disabled={verified}
                />
                <div className="absolute right-4 top-4 text-primary font-bold text-lg">USD</div>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(val.toString())}
                    className={cn(
                      "text-xs transition-all",
                      amount === val.toString() && "bg-primary text-primary-foreground border-primary"
                    )}
                    disabled={verified}
                  >
                    ${val}
                  </Button>
                ))}
              </div>
            </div>

            {selectedMethod === "safaricom" && (
              <>
                {/* Safaricom Payment Instructions */}
                <div className="p-5 rounded-lg bg-green-500/10 border border-green-500/30 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📱</div>
                    <div>
                      <h4 className="font-bold text-green-300 mb-1">Safaricom M-Pesa Transfer</h4>
                      <p className="text-xs text-green-200/80">Send money using Safaricom M-Pesa to the account details below</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-background/50 border border-green-500/20">
                      <div className="text-xs text-muted-foreground mb-2 font-bold">Paybill Number</div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-2xl font-mono font-bold text-primary tracking-wider">880100</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard("880100")}
                          className="hover:bg-primary/20"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-green-500/20">
                      <div className="text-xs text-muted-foreground mb-2 font-bold">Account Number</div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-2xl font-mono font-bold text-primary tracking-wider">1004508555</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard("1004508555")}
                          className="hover:bg-primary/20"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Code Input */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-base font-bold mb-2 block">Safaricom Transaction Code</Label>
                    <p className="text-xs text-muted-foreground">Safaricom sends this code via SMS after your transaction</p>
                  </div>
                  <Input 
                    type="text"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                    placeholder="Enter 10+ character code" 
                    className="text-xl h-14 font-mono tracking-wider border-2 border-primary/30 bg-background/50 focus:border-primary"
                    disabled={loading || verified}
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">Each code can only be used once for security</p>
                </div>
              </>
            )}

            {/* Summary */}
            <div className="p-5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Deposit Amount:</span>
                <span className="font-mono font-bold text-lg">${parseFloat(amount || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Processing Fee:</span>
                <span className="font-mono font-bold text-chart-up">FREE</span>
              </div>
              <div className="border-t border-primary/20 pt-2 flex justify-between items-center">
                <span className="font-bold text-base">You'll Receive:</span>
                <span className="font-mono font-bold text-xl text-chart-up">${parseFloat(amount || "0").toFixed(2)}</span>
              </div>
            </div>

            {/* Deposit Button */}
            <Button 
              onClick={verifyDeposit}
              disabled={loading || !transactionCode || verified || selectedMethod !== "safaricom"}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50"
            >
              {loading ? "🔍 Verifying with Safaricom..." : verified ? "✓ Verified & Credited!" : "Verify Transaction & Deposit"}
            </Button>

            {/* Security Note */}
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex gap-3">
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-green-400 mb-1">🔒 Verified & Secure</p>
                <p className="text-xs text-green-400/80">We verify every transaction with Safaricom before crediting your account. Your funds are protected by bank-level encryption.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Deposit Process Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {depositPlan.map((plan) => (
              <Card key={plan.step} className="p-5 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mb-3 border-2 border-primary/50">
                    <span className="text-2xl">{plan.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Step {plan.step}</h3>
                  <p className="text-sm font-medium mb-1">{plan.title}</p>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 border-yellow-500/30 bg-yellow-500/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2">How long does it take?</h4>
              <p className="text-sm text-muted-foreground">Deposits are verified and credited instantly after we confirm the transaction with Safaricom.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Is there a minimum deposit?</h4>
              <p className="text-sm text-muted-foreground">Yes, the minimum deposit is $10. Maximum is $50,000 per transaction.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Are there fees?</h4>
              <p className="text-sm text-muted-foreground">No! We charge zero fees on deposits. M-Pesa charges are handled by Safaricom.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">How do I verify my deposit?</h4>
              <p className="text-sm text-muted-foreground">Safaricom sends you an SMS confirmation code. Enter it above and we verify with the bank instantly.</p>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
