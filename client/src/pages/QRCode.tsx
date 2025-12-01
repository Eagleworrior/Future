import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Share2, Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function QRCodePage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256&data=${encodeURIComponent(appUrl)}`;

  const downloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "expert-trade-qr.png";
      link.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "✓ QR Code downloaded" });
    } catch (err) {
      toast({ title: "Error downloading QR code", variant: "destructive" });
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "✓ Link copied to clipboard" });
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Expert Trade",
          text: "Join me on Expert Trade - Professional Binary Options Trading Platform",
          url: appUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      copyUrl();
    }
  };

  return (
    <Shell>
      <div className="w-full space-y-8 pb-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border border-blue-500/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-small-white/[0.03] opacity-100"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">Share Expert Trade</span>
                </h1>
                <p className="text-lg text-slate-300">Scan the QR code with your phone or copy the link to access the app</p>
              </div>
              <div className="text-6xl md:text-7xl">📱</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1">📲 Scan to Open</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1">🔗 Share Link</Badge>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1">⬇️ Download QR</Badge>
            </div>
          </div>
        </div>

        {/* Main QR Code Card */}
        <Card className="p-12 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex flex-col items-center space-y-8">
            <div>
              <p className="text-center text-muted-foreground mb-4 font-medium">Scan with your phone camera or Expo Go app</p>
              <div id="qrcode" className="p-6 bg-white rounded-2xl shadow-2xl">
                <img
                  src={qrCodeUrl}
                  alt="Expert Trade QR Code"
                  className="w-64 h-64"
                />
              </div>
            </div>

            <div className="w-full grid md:grid-cols-3 gap-4">
              <Button
                onClick={downloadQR}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
              <Button
                onClick={shareApp}
                variant="outline"
                className="h-12 border-slate-700 hover:bg-slate-800"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share App
              </Button>
              <Button
                onClick={copyUrl}
                variant="outline"
                className="h-12 border-slate-700 hover:bg-slate-800"
              >
                {copied ? "✓ Copied" : <><Copy className="w-4 h-4 mr-2" /> Copy Link</>}
              </Button>
            </div>
          </div>
        </Card>

        {/* App Link Section */}
        <Card className="p-8 border-blue-500/30 bg-blue-500/10">
          <h2 className="text-2xl font-bold mb-4">Direct Link</h2>
          <div className="p-4 rounded-lg bg-background/50 border border-blue-500/20 font-mono text-sm break-all">
            {appUrl}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Share this link with anyone to let them access Expert Trade. They can open it on any device with a web browser.
          </p>
        </Card>

        {/* How to Use */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 border-purple-500/30 bg-purple-500/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-400" />
              Scan QR Code
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-purple-400 flex-shrink-0">1.</span>
                <span>Open your phone camera or Expo Go app</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-purple-400 flex-shrink-0">2.</span>
                <span>Point at the QR code above</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-purple-400 flex-shrink-0">3.</span>
                <span>Tap the notification to open Expert Trade</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-purple-400 flex-shrink-0">4.</span>
                <span>Start trading! 🚀</span>
              </li>
            </ol>
          </Card>

          <Card className="p-8 border-cyan-500/30 bg-cyan-500/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              Share With Friends
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-cyan-400 flex-shrink-0">1.</span>
                <span>Click "Share App" or copy the link</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-cyan-400 flex-shrink-0">2.</span>
                <span>Send via WhatsApp, Email, SMS, etc.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-cyan-400 flex-shrink-0">3.</span>
                <span>Your friends click the link</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-cyan-400 flex-shrink-0">4.</span>
                <span>They join Expert Trade instantly! 🎉</span>
              </li>
            </ol>
          </Card>
        </div>

        {/* Install as App */}
        <Card className="p-8 border-green-500/30 bg-green-500/10">
          <h3 className="text-xl font-bold mb-4">💾 Install as App (PWA)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Install Expert Trade on your phone like a native app, even without the app stores:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-green-400 mb-2">📱 On iPhone:</p>
              <ol className="space-y-1 text-xs">
                <li>1. Open Safari</li>
                <li>2. Tap Share button</li>
                <li>3. Select "Add to Home Screen"</li>
                <li>4. Expert Trade app appears!</li>
              </ol>
            </div>
            <div>
              <p className="font-bold text-green-400 mb-2">🤖 On Android:</p>
              <ol className="space-y-1 text-xs">
                <li>1. Open Chrome browser</li>
                <li>2. Tap menu (⋮)</li>
                <li>3. Select "Install app"</li>
                <li>4. Expert Trade app appears!</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Referral Note */}
        <Card className="p-8 border-yellow-500/30 bg-yellow-500/10">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            💰 Earn Referral Rewards
          </h3>
          <p className="text-sm text-muted-foreground">
            When you share Expert Trade with friends and they sign up, you both earn referral bonuses! Each successful referral gives you loyalty points and bonus trading funds.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
