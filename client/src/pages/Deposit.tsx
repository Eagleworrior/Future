import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Deposit() {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("100");
  const [transactionCode, setTransactionCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const verifyDeposit = async () => {
    if (!transactionCode || transactionCode.trim() === "") {
      toast({ title: "Please enter transaction code", variant: "destructive" });
      return;
    }

    if (parseFloat(amount) < 50) {
      toast({ title: "Minimum deposit is $50", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVerified(true);
    toast({
      title: "Deposit Verified! ✓",
      description: `$${amount} has been added to your account`,
    });

    setTimeout(() => {
      setAmount("100");
      setTransactionCode("");
      setVerified(false);
    }, 3000);

    setLoading(false);
  };

  return (
    <Shell>
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display mb-2">Deposit Funds</h1>
          <p className="text-muted-foreground">Add funds to your account to start trading</p>
        </div>

        <div className="grid gap-6">
          {/* Payment Instructions */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Payment Instructions
              </CardTitle>
              <CardDescription>Use the details below to send funds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Paybill Number</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-2xl font-mono font-bold tracking-wider">880100</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("880100")}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Account Number</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-2xl font-mono font-bold tracking-wider">1004508555</div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("1004508555")}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-500/90">
                  <p className="font-bold mb-1">Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Send money to Paybill 880100, Account 1004508555</li>
                    <li>Copy the transaction/reference code from your bank</li>
                    <li>Paste the code below to verify your deposit</li>
                    <li>Funds will be added instantly upon verification</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit Amount & Verification</CardTitle>
              <CardDescription>Minimum deposit: $50 • Maximum: $50,000</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {verified && (
                <div className="p-4 rounded-lg bg-chart-up/10 border border-chart-up/30 flex items-center gap-3">
                  <Check className="w-5 h-5 text-chart-up" />
                  <div>
                    <p className="font-bold text-chart-up">Deposit Confirmed</p>
                    <p className="text-sm text-chart-up/80">${amount} has been credited to your account</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Deposit Amount ($)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100" 
                    min="50"
                    max="50000"
                    className="text-xl h-12 pr-12"
                  />
                  <div className="absolute right-4 top-3 text-muted-foreground">USD</div>
                </div>
                <p className="text-xs text-muted-foreground">Min: $50 | Max: $50,000</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Transaction Code</Label>
                <Input 
                  type="text"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  placeholder="Enter transaction/reference code from your bank"
                  className="text-lg h-12 font-mono"
                />
                <p className="text-xs text-muted-foreground">Paste the reference code provided by your bank after sending the money</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/50 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-mono font-bold">${parseFloat(amount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-mono">Free</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                  <span className="font-medium">You'll Receive</span>
                  <span className="font-mono font-bold text-chart-up">${parseFloat(amount || "0").toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={verifyDeposit}
                disabled={loading || !transactionCode || verified}
                className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90"
              >
                {loading ? "Verifying..." : verified ? "✓ Verified" : "Verify & Deposit"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
