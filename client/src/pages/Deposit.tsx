import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Deposit() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <Shell>
      <div className="container max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-display font-bold mb-8">Deposit Funds</h1>
        
        <div className="grid gap-6">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Payment Details
              </CardTitle>
              <CardDescription>Use the details below to fund your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Paybill Number</div>
                    <div className="text-2xl font-mono font-bold tracking-wider text-white">880100</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard("880100")}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Account Number</div>
                    <div className="text-2xl font-mono font-bold tracking-wider text-white">1004508555</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard("1004508555")}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
              <CardDescription>Minimum deposit amount is $50</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input 
                  type="number" 
                  placeholder="50" 
                  min="50"
                  className="text-lg h-12" 
                />
              </div>
              
              <Button className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                Confirm Deposit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
