import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";

export default function Withdraw() {
  return (
    <Shell>
      <div className="container max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-display font-bold mb-8">Withdraw Funds</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-destructive" />
              Request Withdrawal
            </CardTitle>
            <CardDescription>Minimum withdrawal amount is $100</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Withdrawal Amount ($)</Label>
              <Input 
                type="number" 
                placeholder="100" 
                min="100"
                className="text-lg h-12" 
              />
              <p className="text-xs text-muted-foreground">Available balance: $1,240.50</p>
            </div>

            <div className="space-y-2">
              <Label>Select Method</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-primary/50 bg-primary/10 p-4 rounded-lg text-center cursor-pointer ring-2 ring-primary">
                  Bank Transfer
                </div>
                <div className="border border-border hover:border-primary/50 bg-card p-4 rounded-lg text-center cursor-pointer transition-all">
                  Mobile Money
                </div>
              </div>
            </div>
            
            <Button className="w-full h-12 text-lg font-bold bg-destructive text-white hover:bg-destructive/90">
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
