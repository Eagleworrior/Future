import { useEffect, useRef } from "react";
import { shouldShowAdMob, ADMOB_CONFIG } from "@/lib/adConfig";

interface AdMobAdProps {
  unitId?: string;
  type?: "banner" | "interstitial";
}

export function AdMobAd({ unitId = ADMOB_CONFIG.BANNER_UNIT_ID, type = "banner" }: AdMobAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldShowAdMob()) return;

    try {
      // Load Google Mobile Ads SDK
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.setAttribute("data-ad-client", ADMOB_CONFIG.APP_ID);
      document.head.appendChild(script);

      // Initialize ads
      setTimeout(() => {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }, 100);
    } catch (err) {
      console.log("AdMob loading skipped");
    }
  }, []);

  if (!shouldShowAdMob()) {
    return null;
  }

  if (type === "interstitial") {
    return null; // Interstitial ads are handled separately
  }

  return (
    <div
      ref={containerRef}
      className="my-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700 flex items-center justify-center min-h-[100px]"
      data-testid="admob-container"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        data-ad-client={ADMOB_CONFIG.APP_ID}
        data-ad-slot={unitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
