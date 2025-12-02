import { useEffect } from "react";
import { shouldShowAdSense } from "@/lib/adConfig";

interface AdSenseAdProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  responsive?: boolean;
}

export function AdSenseAd({ slot, format = "auto", responsive = true }: AdSenseAdProps) {
  useEffect(() => {
    if (!shouldShowAdSense()) return;

    try {
      // Load Google AdSense script
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3715923077671486";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      // Push ad after script loads
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (err) {
      console.log("AdSense loading skipped");
    }
  }, []);

  if (!shouldShowAdSense()) {
    return null;
  }

  return (
    <div
      className="my-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700 flex items-center justify-center min-h-[250px]"
      data-testid="adsense-container"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        data-ad-client="ca-pub-3715923077671486"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
}
