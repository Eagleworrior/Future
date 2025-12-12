import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { User, Mail, DollarSign, Globe, Gem, Shield, Award, X } from 'lucide-react';

const MOCK_USER_DATA = {
  name: "Norman Narubo...",
  accountType: "Islamic halal account",
  id: "83153426",
  email: "lomalianorman@gmail.cc",
  balance: 1804.76,
  ip: "102.68.78.215",
  avatar: "/path/to/avatar.png", // Placeholder path
  countryFlag: "🇰🇪",
};

const MOCK_ACHIEVEMENTS = {
  level: 1,
  xp: 45,
  xpGoal: 100,
  gems: {
    red: 0,
    blue: 0,
    green: 0,
    purple: 0
  },
  tasks: [
    { current: 4, goal: 110, reward: 5 },
    { current: 0, goal: 16, reward: 0 },
    { current: 1, goal: 24, reward: 1 }
  ]
};

const MOCK_STATS = {
  trades: 0,
  turnover: 0,
  profit: 0
};

export default function Account() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700 text-white mt-8 mb-4">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={MOCK_USER_DATA.avatar} alt="User" />
                    <AvatarFallback>NN</AvatarFallback>
                </Avatar>
                <span className="font-bold">QT Demo</span>
                <span className="text-green-400 font-semibold">Halal</span>
                <span>USD</span>
            </div>
            <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
            </Button>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Profile Info */}
          <Card className="bg-slate-800/50 p-4 flex items-center gap-4 border-slate-700">
            <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-green-500">
                    <AvatarImage src={MOCK_USER_DATA.avatar} alt="User" />
                    <AvatarFallback>NN</AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Star className="w-3 h-3 text-white" fill="white" />
                </div>
            </div>
            <div className="space-y-1 text-sm">
              <h3 className="font-bold text-lg">{MOCK_USER_DATA.countryFlag} {MOCK_USER_DATA.name}</h3>
              <p className="text-green-400 font-semibold flex items-center gap-1"><Shield className="w-4 h-4" /> {MOCK_USER_DATA.accountType}</p>
              <p className="text-slate-400 flex items-center gap-1"><User className="w-4 h-4" /> id {MOCK_USER_DATA.id}</p>
              <p className="text-slate-400 flex items-center gap-1"><Mail className="w-4 h-4" /> {MOCK_USER_DATA.email}</p>
              <p className="text-slate-400 flex items-center gap-1"><DollarSign className="w-4 h-4" /> {MOCK_USER_DATA.balance.toFixed(2)}</p>
              <p className="text-slate-400 flex items-center gap-1"><Globe className="w-4 h-4" /> {MOCK_USER_DATA.ip} {MOCK_USER_DATA.countryFlag}</p>
            </div>
          </Card>

          {/* Demo Account Banner */}
          <div className="bg-red-600/80 text-white text-center font-bold p-2 rounded-md">
            YOU ARE TRADING ON DEMO ACCOUNT
          </div>

          {/* Achievements */}
          <Card className="bg-slate-800/50 p-4 border-slate-700">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold">Your achievements:</h4>
                <Button variant="ghost" size="icon" className="w-6 h-6"><RefreshCw className="w-4 h-4" /></Button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <Award className="w-10 h-10 text-yellow-500" />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">{MOCK_ACHIEVEMENTS.level}</span>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold mb-1">Experience Points</p>
                    <Progress value={(MOCK_ACHIEVEMENTS.xp / MOCK_ACHIEVEMENTS.xpGoal) * 100} className="h-2" />
                    <p className="text-xs text-right mt-1 text-slate-400">{MOCK_ACHIEVEMENTS.xp} / {MOCK_ACHIEVEMENTS.xpGoal} XP</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center mb-4">
                <div>
                    <Gem className="w-6 h-6 mx-auto text-red-500" />
                    <p className="text-sm font-bold mt-1">{MOCK_ACHIEVEMENTS.gems.red}</p>
                </div>
                 <div>
                    <Gem className="w-6 h-6 mx-auto text-cyan-500" />
                    <p className="text-sm font-bold mt-1">{MOCK_ACHIEVEMENTS.gems.blue}</p>
                </div>
                 <div>
                    <Gem className="w-6 h-6 mx-auto text-green-500" />
                    <p className="text-sm font-bold mt-1">{MOCK_ACHIEVEMENTS.gems.green}</p>
                </div>
                 <div>
                    <Gem className="w-6 h-6 mx-auto text-purple-500" />
                    <p className="text-sm font-bold mt-1">{MOCK_ACHIEVEMENTS.gems.purple}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MOCK_ACHIEVEMENTS.tasks.map((task, i) => (
                <Button key={i} variant="outline" className="h-auto flex-col border-slate-600 bg-slate-800 hover:bg-slate-700">
                  <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">+{task.reward}</span>
                  <span className="text-xs mt-1">{task.current}/{task.goal}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Real Account Stats */}
          <Card className="bg-slate-800/50 p-4 border-slate-700">
             <h4 className="font-bold mb-3">Real account statistics for today:</h4>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Trades:</span> <span>{MOCK_STATS.trades}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Trading turnover:</span> <span>{MOCK_STATS.turnover}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Trading profit:</span> <span>{MOCK_STATS.profit}</span></div>
             </div>
             <Button variant="outline" className="w-full mt-4 border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300">
                REAL ACCOUNT OVERALL STATISTICS
             </Button>
          </Card>

          <Button variant="secondary" className="w-full">
            &lt;&lt; Accounts
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Add missing lucide icons for compilation
const Star = ({ className, fill = 'none' }: { className?: string, fill?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const RefreshCw = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
);
