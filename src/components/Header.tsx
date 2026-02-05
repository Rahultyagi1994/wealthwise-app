import { TrendingUp, User, BarChart3, Lightbulb, PiggyBank } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasProfile: boolean;
}

export function Header({ activeTab, setActiveTab, hasProfile }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'advice', label: 'Advice', icon: Lightbulb },
    { id: 'progress', label: 'Progress', icon: PiggyBank },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">WealthWise</h1>
              <p className="text-indigo-200 text-sm">Smart Financial Planning</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-4 flex gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isDisabled = !hasProfile && tab.id !== 'profile';
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600'
                    : isDisabled
                    ? 'text-indigo-300 cursor-not-allowed'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
