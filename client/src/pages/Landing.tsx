import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Zap, Shield, Users, Award, BarChart3, AlertCircle, CheckCircle2, Smartphone, Rocket } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  const features = [
    {
      icon: "📊",
      title: "Live Trading",
      description: "Trade 50+ assets with 5s-10m timeframes and real-time candlestick charts",
      gradient: "from-blue-600 to-blue-400",
    },
    {
      icon: "🤖",
      title: "AI Signals",
      description: "AI-powered trading signals with 75-85% accuracy to guide your trades",
      gradient: "from-purple-600 to-purple-400",
    },
    {
      icon: "🏆",
      title: "Live Tournaments",
      description: "$5K-$250K prize pools in real-time competitive trading tournaments",
      gradient: "from-yellow-600 to-yellow-400",
    },
    {
      icon: "📈",
      title: "Copy Trading",
      description: "Copy trades from top performers and learn from expert traders",
      gradient: "from-green-600 to-green-400",
    },
    {
      icon: "🎖️",
      title: "Gamification",
      description: "Earn badges, loyalty points, and unlock premium features",
      gradient: "from-orange-600 to-orange-400",
    },
    {
      icon: "🔐",
      title: "Secure Banking",
      description: "NCBA Bank integration with verified deposits & withdrawals",
      gradient: "from-red-600 to-red-400",
    },
  ];

  const stats = [
    { number: "50+", label: "Trading Assets" },
    { number: "1M+", label: "Live Data Points" },
    { number: "100K+", label: "Active Traders" },
    { number: "24/7", label: "Market Coverage" },
  ];

  const testimonials = [
    {
      name: "James K.",
      title: "Professional Trader",
      text: "Expert Trade's AI signals gave me a competitive edge I didn't expect. The interface is clean and intuitive.",
      avatar: "👨‍💼",
    },
    {
      name: "Sarah M.",
      title: "Copy Trading User",
      text: "I started with the demo account and now I'm winning tournaments. Copy trading made it so easy!",
      avatar: "👩‍💻",
    },
    {
      name: "Ahmed H.",
      title: "Risk Manager",
      text: "The risk management tools and pattern detection are exactly what I was looking for.",
      avatar: "👨‍⚖️",
    },
  ];

  const pricingPlans = [
    {
      name: "Demo Account",
      price: "Free",
      description: "Perfect for learning",
      features: ["$1,000 practice funds", "All assets & timeframes", "AI signals", "Tournaments entry"],
      badge: "Most Popular",
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "Real Trading",
      price: "Flexible",
      description: "Trade with real money",
      features: ["Deposit from $10", "Full feature access", "Copy trading", "Premium features unlock"],
      color: "from-purple-600 to-purple-400",
    },
  ];

  const faq = [
    {
      question: "Is Expert Trade safe?",
      answer: "Yes! We use NCBA Bank integration for secure deposits/withdrawals, bank-level encryption, and verified transactions.",
    },
    {
      question: "Can I start with a demo account?",
      answer: "Absolutely! Every new user gets a $1,000 demo account to practice trading risk-free.",
    },
    {
      question: "What are the minimum fees?",
      answer: "Zero deposit fees! NCBA charges standard M-Pesa rates. We never take hidden fees.",
    },
    {
      question: "How do AI signals work?",
      answer: "Our AI analyzes candlestick patterns, technical indicators (RSI, MA, Bollinger Bands), and market data to provide signal accuracy percentages.",
    },
    {
      question: "Can I win money in tournaments?",
      answer: "Yes! Join live tournaments with prize pools from $5K-$250K and compete against other traders.",
    },
    {
      question: "What trading instruments are available?",
      answer: "Forex (EUR/USD, GBP/USD, etc.), Crypto (BTC, ETH), Stocks, Commodities (Gold, Oil), and Indices (S&P500, DAX).",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="text-3xl">📈</div>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Expert Trade</span>
          </div>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Start Trading
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-small-white/[0.03]"></div>
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center space-y-6 mb-12">
            <Badge className="mx-auto bg-primary/20 text-primary border border-primary/50 px-4 py-2 text-sm">
              🚀 Professional Binary Options Trading Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Trade Smart.</span>
              <br />
              <span className="text-white">Win Big.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join 100K+ traders on Expert Trade. AI-powered signals, live tournaments, copy trading, and 50+ global instruments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12 px-8 text-lg">
                  Start Free Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-12 px-8 text-lg border-slate-700 hover:bg-slate-800">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-900 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50"></div>
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4 bg-slate-800/50 border-slate-700 h-32 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">📊</span>
                    <Badge className="bg-chart-up/20 text-chart-up">+45%</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Portfolio</p>
                    <p className="font-bold">$1,450</p>
                  </div>
                </Card>
                <Card className="p-4 bg-slate-800/50 border-slate-700 h-32 flex flex-col justify-between md:mt-8">
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="font-bold text-2xl">78%</p>
                  </div>
                  <div className="text-xs text-chart-up">8 wins in last 10</div>
                </Card>
                <Card className="p-4 bg-slate-800/50 border-slate-700 h-32 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">🏆</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300">#12</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tournament</p>
                    <p className="font-bold">$2,500 prize</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-slate-900/50 border-y border-slate-700/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Powerful Features Built for Winners</h2>
            <p className="text-xl text-slate-300">Everything you need to trade like a professional</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50 hover:border-slate-600 transition-all group">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Instruments */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-slate-700/50">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">50+ Trading Instruments</h2>
            <p className="text-xl text-slate-300">Access global markets across all asset classes</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: "💱", name: "Forex", assets: "12+ pairs" },
              { icon: "₿", name: "Crypto", assets: "15+ coins" },
              { icon: "📈", name: "Stocks", assets: "100+ listed" },
              { icon: "🛢️", name: "Commodities", assets: "8+ items" },
              { icon: "📊", name: "Indices", assets: "12+ indices" },
            ].map((group, idx) => (
              <Card key={idx} className="p-6 bg-slate-800/50 border-slate-700 text-center">
                <p className="text-4xl mb-2">{group.icon}</p>
                <p className="font-bold">{group.name}</p>
                <p className="text-xs text-muted-foreground mt-2">{group.assets}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Get Started in 3 Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up free and choose your preferred account type",
                action: "Quick signup in 2 minutes",
              },
              {
                step: "2",
                title: "Learn with Demo",
                description: "$1,000 free demo funds to practice risk-free",
                action: "Master the platform",
              },
              {
                step: "3",
                title: "Start Trading",
                description: "Deposit real money and compete for tournament prizes",
                action: "Join the winners circle",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 relative overflow-hidden group">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-slate-300 mb-4">{item.description}</p>
                <div className="pt-4 border-t border-slate-700 text-sm text-primary">✓ {item.action}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-900/50 border-y border-slate-700/50">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">What Traders Say</h2>
            <p className="text-xl text-slate-300">Join thousands of successful traders</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Start Free, Trade Real</h2>
            <p className="text-xl text-slate-300">No credit card required to start</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 border-2 relative overflow-hidden group ${
                  plan.badge
                    ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 md:col-span-1 ring-2 ring-primary/50"
                    : "border-slate-700 bg-slate-800/30"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-white">{plan.badge}</Badge>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold">{plan.price}</p>
                  <p className="text-sm text-muted-foreground">/month when trading real</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-chart-up flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 h-11">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-900/50 border-y border-slate-700/50">
        <div className="container mx-auto max-w-3xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, idx) => (
              <Card key={idx} className="p-6 bg-slate-800/30 border-slate-700 hover:border-slate-600 transition-all">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer font-bold">
                    <span>{item.question}</span>
                    <span className="text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-slate-300 text-sm">{item.answer}</p>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 bg-gradient-to-r from-primary via-accent to-primary/80 border-0 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-grid-small-white/[0.1]"></div>
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Start Trading?</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join the Expert Trade community today. Get $1,000 demo funds instantly, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth">
                  <Button className="bg-white text-slate-950 hover:bg-slate-100 h-12 px-8 text-lg font-bold">
                    Start Free Demo <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 h-12 px-8 text-lg"
                >
                  Download App
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-4 bg-slate-950">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <div className="text-3xl">📈</div>
                <span>Expert Trade</span>
              </div>
              <p className="text-sm text-muted-foreground">Professional binary options trading platform.</p>
            </div>
            <div>
              <p className="font-bold mb-4">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Download</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Expert Trade. All rights reserved. Binary options trading involves risk.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
