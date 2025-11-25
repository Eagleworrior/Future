import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const inviteLink = "https://expert-trade.app/ref/user123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Invite link copied!" });
  };

  return (
    <Shell>
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold">Invite Friends & Earn</h1>
          <p className="text-xl text-muted-foreground">Get <span className="text-white font-bold">$2</span> for every friend who joins and deposits.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Share this link with your network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm text-muted-foreground truncate font-mono">
                  {inviteLink}
                </div>
                <Button onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Share on Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Track your earnings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <div className="text-3xl font-display font-bold text-white">12</div>
                <div className="text-sm text-muted-foreground">Invited</div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <div className="text-3xl font-display font-bold text-gold">$24.00</div>
                <div className="text-sm text-muted-foreground">Earned</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
