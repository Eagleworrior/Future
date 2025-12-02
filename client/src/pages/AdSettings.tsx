import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio } from "@/components/ui/radio";
import { useState, useEffect } from "react";
import { getAdPreference, setAdPreference, type AdPreference } from "@/lib/adConfig";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";

export default function AdSettings() {
  const [preference, setPreference] = useState<AdPreference>("adsense");
  const { toast } = useToast();

  useEffect(() => {
    setPreference(getAdPreference());
  }, []);

  const handlePreferenceChange = (newPreference: AdPreference) => {
    setPreference(newPreference);
    setAdPreference(newPreference);
    toast({
      title: "✓ Ad preference updated",
      description: `You've selected ${newPreference === "none" ? "no ads" : newPreference} ads`,
    });
  };

  const adOptions = [
    {
      id: "adsense" as const,
      title: "Google AdSense",
      description: "Non-intrusive text and display ads",
      icon: "🔍",
      pros: ["Contextual ads", "Non-intrusive", "Seamless integration"],
      cons: ["Lower earnings potential"],
    },
    {
      id: "admob" as const,
      title: "Google AdMob",
      description: "Rich media and video ads",
      icon: "📱",
      pros: ["Higher earnings", "Video ads", "Rich media"],
      cons: ["More intrusive", "Better for mobile"],
    },
    {
      id: "none" as const,
      title: "Ad-Free",
      description: "No ads at all",
      icon: "✨",
      pros: ["Clean experience", "No distractions", "Premium feel"],
      cons: ["No ad revenue"],
    },
  ];

  return (
    <Shell>
      <div className="w-full space-y-8 pb-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 border border-purple-500/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-small-white/[0.03] opacity-100"></div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                Ad Preferences
              </span>
            </h1>
            <p className="text-lg text-slate-300">Choose how you want to experience ads in Expert Trade</p>
          </div>
        </div>

        {/* Current Selection */}
        <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currently Selected</p>
              <p className="text-xl font-bold capitalize">{preference === "none" ? "Ad-Free" : preference}</p>
            </div>
            <Badge className="bg-primary/20 text-primary border border-primary/50 px-4 py-2">
              {preference === "adsense" && "✓ Active"}
              {preference === "admob" && "✓ Active"}
              {preference === "none" && "✓ Active"}
            </Badge>
          </div>
        </Card>

        {/* Ad Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Options</h2>
          <div className="grid gap-4">
            {adOptions.map((option) => (
              <Card
                key={option.id}
                className={`p-6 cursor-pointer transition-all border-2 ${
                  preference === option.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                    : "border-slate-700 hover:border-slate-600 bg-slate-800/30"
                }`}
                onClick={() => handlePreferenceChange(option.id)}
                data-testid={`ad-option-${option.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{option.title}</h3>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center">
                        {preference === option.id && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-chart-up mb-2">Pros:</p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {option.pros.map((pro, i) => (
                            <li key={i}>✓ {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-chart-down mb-2">Cons:</p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {option.cons.map((con, i) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 border-blue-500/30 bg-blue-500/10">
            <h3 className="font-bold text-blue-300 mb-2">💰 Support the App</h3>
            <p className="text-sm text-blue-200/80">
              By enabling ads, you help support Expert Trade's development and keep the platform free for everyone.
            </p>
          </Card>
          <Card className="p-6 border-green-500/30 bg-green-500/10">
            <h3 className="font-bold text-green-300 mb-2">🎁 Ad-Free Premium</h3>
            <p className="text-sm text-green-200/80">
              Premium members can disable ads completely and enjoy an uninterrupted trading experience.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="p-6 border-yellow-500/30 bg-yellow-500/10">
          <h3 className="text-lg font-bold mb-4">ℹ️ How Ads Work</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="font-bold text-yellow-400 flex-shrink-0">1.</span>
              <span>
                <strong>AdSense</strong> shows contextual ads based on your interests. They're less intrusive but generate moderate revenue.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-yellow-400 flex-shrink-0">2.</span>
              <span>
                <strong>AdMob</strong> displays rich media and video ads. More profitable for developers but takes up more space.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-yellow-400 flex-shrink-0">3.</span>
              <span>
                <strong>Ad-Free</strong> completely removes all advertisements from your experience.
              </span>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12 px-8">
            <ChevronRight className="w-4 h-4 mr-2" />
            Changes Saved
          </Button>
        </div>
      </div>
    </Shell>
  );
}
