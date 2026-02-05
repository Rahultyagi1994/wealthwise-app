import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProfile, Investment, Goal } from './types';

// Auth Page Component
function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      const result = await signUp(email, password, name);
      if (!result.success) {
        setError(result.error || 'An error occurred');
      }
    } else if (mode === 'signin') {
      const result = await signIn(email, password, rememberMe);
      if (!result.success) {
        setError(result.error || 'An error occurred');
      }
    } else if (mode === 'forgot') {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.');
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <h1 className="text-3xl font-bold text-white">WealthWise</h1>
          <p className="text-slate-400 mt-2">Your AI-Powered Financial Advisor</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {mode === 'forgot' ? (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔐</div>
                <h2 className="text-xl font-bold text-white">Reset Password</h2>
                <p className="text-slate-400 text-sm mt-1">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
                  className="w-full py-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  ← Back to Sign In
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex mb-6">
                <button
                  onClick={() => { setMode('signin'); setError(''); }}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${mode === 'signin' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`flex-1 py-2 text-center rounded-lg transition-colors ${mode === 'signup' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {mode === 'signin' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-slate-400 text-sm">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-700 border-white/10 text-emerald-500 focus:ring-emerald-500"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                      className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Your data is securely stored and never shared
        </p>
      </div>
    </div>
  );
}

// Types for financial calculations
interface HealthScore {
  overall: number;
  savings: number;
  emergency: number;
  debt: number;
  investing: number;
  goals: number;
}

// Main App wrapper with Auth
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// App content that uses auth
function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-400">Loading WealthWise...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MainApp />;
}

// Main application after login
function MainApp() {
  const { 
    user, 
    signOut, 
    userData, 
    updateProfile, 
    updateInvestments, 
    updateGoals, 
    updateAchievements,
    isOnline 
  } = useAuth();
  
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  const profile = userData.profile;
  const investments = userData.investments;
  const goals = userData.goals;
  const achievements = userData.achievements;
  
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const netWorth = (profile?.currentSavings || 0) + totalInvestments;
  
  const saveProfile = (newProfile: UserProfile) => {
    updateProfile(newProfile);
  };
  
  const addInvestment = (inv: Omit<Investment, 'id'>) => {
    const newInv: Investment = { ...inv, id: `inv_${Date.now()}` };
    updateInvestments([...investments, newInv]);
  };
  
  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    updateInvestments(investments.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  };
  
  const deleteInvestment = (id: string) => {
    updateInvestments(investments.filter(inv => inv.id !== id));
  };
  
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = { ...goal, id: `goal_${Date.now()}` };
    updateGoals([...goals, newGoal]);
  };
  
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    updateGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  };
  
  const deleteGoal = (id: string) => {
    updateGoals(goals.filter(g => g.id !== id));
  };
  
  // Check and unlock achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = [...achievements];
      const unlockedIds = newAchievements.map(a => a.id);
      
      // First profile
      if (profile && !unlockedIds.includes('first_profile')) {
        newAchievements.push({
          id: 'first_profile',
          name: 'Getting Started',
          description: 'Created your financial profile',
          icon: '🎯',
          category: 'learning',
          unlockedAt: new Date().toISOString()
        });
      }
      
      // First $1k invested
      if (totalInvestments >= 1000 && !unlockedIds.includes('first_1k')) {
        newAchievements.push({
          id: 'first_1k',
          name: 'First $1,000',
          description: 'Invested your first $1,000',
          icon: '💰',
          category: 'investing',
          unlockedAt: new Date().toISOString()
        });
      }
      
      // First $10k invested
      if (totalInvestments >= 10000 && !unlockedIds.includes('first_10k')) {
        newAchievements.push({
          id: 'first_10k',
          name: 'Five Figure Investor',
          description: 'Total investments reached $10,000',
          icon: '🚀',
          category: 'investing',
          unlockedAt: new Date().toISOString()
        });
      }
      
      // First goal
      if (goals.length > 0 && !unlockedIds.includes('first_goal')) {
        newAchievements.push({
          id: 'first_goal',
          name: 'Goal Setter',
          description: 'Set your first financial goal',
          icon: '🎯',
          category: 'goals',
          unlockedAt: new Date().toISOString()
        });
      }
      
      if (newAchievements.length > achievements.length) {
        updateAchievements(newAchievements);
      }
    };
    
    checkAchievements();
  }, [profile, totalInvestments, goals.length]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Show profile setup if no profile exists
  useEffect(() => {
    if (!profile) {
      setShowProfileModal(true);
    }
  }, [profile]);

  // Calculate health score
  const calculateHealthScore = (): HealthScore => {
    if (!profile) return { overall: 0, savings: 0, emergency: 0, debt: 0, investing: 0, goals: 0 };

    const savingsRate = profile.monthlyIncome > 0 ? (profile.monthlySavings / profile.monthlyIncome) * 100 : 0;
    const savingsScore = Math.min(100, savingsRate * 5); // 20% savings = 100 score

    const emergencyMonths = profile.monthlyExpenses > 0 ? profile.currentSavings / profile.monthlyExpenses : 0;
    const emergencyScore = Math.min(100, (emergencyMonths / 6) * 100); // 6 months = 100 score

    const debtScore = 80; // Placeholder - would need debt data

    const investingScore = Math.min(100, (totalInvestments / (profile.monthlyIncome * 12)) * 100);

    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    const goalsScore = goals.length > 0 ? (completedGoals / goals.length) * 100 : 50;

    const overall = (savingsScore + emergencyScore + debtScore + investingScore + goalsScore) / 5;

    return {
      overall: Math.round(overall),
      savings: Math.round(savingsScore),
      emergency: Math.round(emergencyScore),
      debt: Math.round(debtScore),
      investing: Math.round(investingScore),
      goals: Math.round(goalsScore)
    };
  };

  const healthScore = calculateHealthScore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'advisor', label: 'AI Advisor', icon: '🤖' },
    { id: 'investments', label: 'Investments', icon: '📈' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'tools', label: 'Tools', icon: '🧮' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-white">WealthWise</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Connection Status & Debug */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isOnline 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isOnline ? 'Cloud' : 'Local'}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-white text-sm hidden sm:block">{user?.name}</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-slate-400 text-sm">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>⚙️</span> Edit Profile
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden overflow-x-auto border-t border-white/5">
          <div className="flex px-2 py-2 gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            healthScore={healthScore}
            investments={investments}
            goals={goals}
            netWorth={netWorth}
            totalInvestments={totalInvestments}
            onEditProfile={() => setShowProfileModal(true)}
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorView
            profile={profile}
            investments={investments}
            goals={goals}
            healthScore={healthScore}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsView
            profile={profile}
            investments={investments}
            onAddInvestment={() => setShowInvestmentModal(true)}
            onUpdateInvestment={updateInvestment}
            onDeleteInvestment={deleteInvestment}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            onAddGoal={() => setShowGoalModal(true)}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsView profile={profile} />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView achievements={achievements} />
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          userName={user?.name || ''}
          userEmail={user?.email || ''}
          onSave={(newProfile) => { saveProfile(newProfile); setShowProfileModal(false); }}
          onClose={() => profile && setShowProfileModal(false)}
        />
      )}

      {/* Investment Modal */}
      {showInvestmentModal && (
        <InvestmentModal
          onSave={(inv) => { addInvestment(inv); setShowInvestmentModal(false); }}
          onClose={() => setShowInvestmentModal(false)}
        />
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal
          onSave={(goal) => { addGoal(goal); setShowGoalModal(false); }}
          onClose={() => setShowGoalModal(false)}
        />
      )}

      {/* Debug Panel */}
      {showDebugPanel && (
        <DebugPanel
          user={user}
          userData={userData}
          isOnline={isOnline}
          onClose={() => setShowDebugPanel(false)}
        />
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({
  profile,
  healthScore,
  goals,
  netWorth,
  totalInvestments,
  onEditProfile
}: {
  profile: UserProfile | null;
  healthScore: HealthScore;
  investments: Investment[];
  goals: Goal[];
  netWorth: number;
  totalInvestments: number;
  onEditProfile: () => void;
}) {
  if (!profile) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to WealthWise!</h2>
        <p className="text-slate-400 mb-6">Let's set up your financial profile to get started.</p>
        <button
          onClick={onEditProfile}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium"
        >
          Create Your Profile
        </button>
      </div>
    );
  }

  const emergencyMonths = profile.monthlyExpenses > 0 ? profile.currentSavings / profile.monthlyExpenses : 0;
  const savingsRate = profile.monthlyIncome > 0 ? (profile.monthlySavings / profile.monthlyIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {profile.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-400">Here's your financial overview</p>
        </div>
      </div>

      {/* Health Score Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="relative flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
              <circle
                cx="64" cy="64" r="56"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${healthScore.overall * 3.52} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{healthScore.overall}</div>
                <div className="text-white/70 text-xs">Health Score</div>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Savings', score: healthScore.savings, icon: '💰' },
              { label: 'Emergency', score: healthScore.emergency, icon: '🛡️' },
              { label: 'Investing', score: healthScore.investing, icon: '📈' },
              { label: 'Goals', score: healthScore.goals, icon: '🎯' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{item.icon}</span>
                  <span className="text-white/80 text-sm">{item.label}</span>
                </div>
                <div className="text-white font-bold">{item.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Net Worth', value: `$${netWorth.toLocaleString()}`, icon: '💎', color: 'from-purple-500 to-pink-500' },
          { label: 'Investments', value: `$${totalInvestments.toLocaleString()}`, icon: '📈', color: 'from-green-500 to-emerald-500' },
          { label: 'Savings', value: `$${profile.currentSavings.toLocaleString()}`, icon: '🏦', color: 'from-blue-500 to-cyan-500' },
          { label: 'Monthly Income', value: `$${profile.monthlyIncome.toLocaleString()}`, icon: '💵', color: 'from-orange-500 to-amber-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
            <div className="text-white text-xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Emergency Fund Progress</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">{emergencyMonths.toFixed(1)} months saved</span>
            <span className="text-emerald-400">Goal: 6 months</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (emergencyMonths / 6) * 100)}%` }}
            />
          </div>
          <p className="text-slate-500 text-sm mt-2">
            ${profile.currentSavings.toLocaleString()} / ${(profile.monthlyExpenses * 6).toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Savings Rate</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">Current rate</span>
            <span className={savingsRate >= 20 ? 'text-emerald-400' : 'text-amber-400'}>{savingsRate.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${savingsRate >= 20 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
              style={{ width: `${Math.min(100, (savingsRate / 30) * 100)}%` }}
            />
          </div>
          <p className="text-slate-500 text-sm mt-2">
            ${profile.monthlySavings.toLocaleString()} / ${profile.monthlyIncome.toLocaleString()} monthly
          </p>
        </div>
      </div>

      {/* Goals Preview */}
      {goals.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Active Goals</h3>
          <div className="space-y-3">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  {goal.category === 'emergency' ? '🛡️' : goal.category === 'retirement' ? '🏖️' : goal.category === 'house' ? '🏠' : '🎯'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm">{goal.name}</span>
                    <span className="text-slate-400 text-sm">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// AI Advisor View
function AdvisorView({
  profile,
  investments,
  goals,
  healthScore,
  onNavigate
}: {
  profile: UserProfile | null;
  investments: Investment[];
  goals: Goal[];
  healthScore: HealthScore;
  onNavigate: (tab: string) => void;
}) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; actions?: Array<{ label: string; action: string }> }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const totalInvestments = investments.reduce((sum: number, inv: Investment) => sum + inv.currentValue, 0);
  const emergencyMonths = profile && profile.monthlyExpenses > 0 ? profile.currentSavings / profile.monthlyExpenses : 0;

  const generateResponse = (userMessage: string): { content: string; actions?: Array<{ label: string; action: string }> } => {
    const lowerMessage = userMessage.toLowerCase();

    if (!profile) {
      return {
        content: "I'd love to help you, but first I need to know more about your financial situation. Please complete your profile so I can give you personalized advice!",
        actions: [{ label: 'Complete Profile', action: 'profile' }]
      };
    }

    // Analyze finances
    if (lowerMessage.includes('analyze') || lowerMessage.includes('overview') || lowerMessage.includes('summary') || lowerMessage.includes('how am i doing')) {
      const savingsRate = (profile.monthlySavings / profile.monthlyIncome) * 100;
      let analysis = `📊 **Financial Analysis for ${profile.name}**\n\n`;
      analysis += `**Health Score: ${healthScore.overall}/100** ${healthScore.overall >= 70 ? '🟢' : healthScore.overall >= 50 ? '🟡' : '🔴'}\n\n`;
      analysis += `**Income & Savings:**\n`;
      analysis += `• Monthly Income: $${profile.monthlyIncome.toLocaleString()}\n`;
      analysis += `• Monthly Savings: $${profile.monthlySavings.toLocaleString()} (${savingsRate.toFixed(1)}%)\n`;
      analysis += `• Current Savings: $${profile.currentSavings.toLocaleString()}\n\n`;
      analysis += `**Emergency Fund:**\n`;
      analysis += `• ${emergencyMonths.toFixed(1)} months of expenses saved ${emergencyMonths >= 6 ? '✅' : emergencyMonths >= 3 ? '⚠️' : '❌'}\n\n`;
      analysis += `**Investments:**\n`;
      analysis += `• Total Invested: $${totalInvestments.toLocaleString()}\n`;
      analysis += `• Number of Holdings: ${investments.length}\n\n`;

      if (savingsRate < 20) {
        analysis += `💡 **Recommendation:** Try to increase your savings rate to at least 20%.`;
      } else if (emergencyMonths < 6) {
        analysis += `💡 **Recommendation:** Focus on building your emergency fund to 6 months.`;
      } else {
        analysis += `💡 **Great job!** You're on a solid financial path. Consider increasing investments.`;
      }

      return { content: analysis, actions: [{ label: 'View Dashboard', action: 'dashboard' }, { label: 'Add Investment', action: 'investments' }] };
    }

    // Investment advice
    if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
      let advice = `📈 **Investment Advice Based on Your Profile**\n\n`;
      advice += `**Your Profile:**\n`;
      advice += `• Risk Tolerance: ${profile.riskTolerance}\n`;
      advice += `• Investment Horizon: ${profile.investmentHorizon}-term\n\n`;

      if (profile.riskTolerance === 'conservative') {
        advice += `**Recommended Allocation:**\n`;
        advice += `• 60% Bonds (Government & Corporate)\n`;
        advice += `• 30% Index Funds (S&P 500)\n`;
        advice += `• 10% Cash/Money Market\n\n`;
        advice += `**Suggested Investments:**\n`;
        advice += `• Vanguard Total Bond Market ETF (BND)\n`;
        advice += `• iShares Core US Aggregate Bond (AGG)\n`;
        advice += `• High-Yield Savings Account (4-5% APY)`;
      } else if (profile.riskTolerance === 'moderate') {
        advice += `**Recommended Allocation:**\n`;
        advice += `• 60% Stocks (Diversified)\n`;
        advice += `• 30% Bonds\n`;
        advice += `• 10% REITs/Alternatives\n\n`;
        advice += `**Suggested Investments:**\n`;
        advice += `• Vanguard Total Stock Market ETF (VTI)\n`;
        advice += `• Schwab US Dividend Equity ETF (SCHD)\n`;
        advice += `• Vanguard Real Estate ETF (VNQ)`;
      } else {
        advice += `**Recommended Allocation:**\n`;
        advice += `• 80% Stocks (Growth-focused)\n`;
        advice += `• 15% Crypto/Alternatives\n`;
        advice += `• 5% Speculative\n\n`;
        advice += `**Suggested Investments:**\n`;
        advice += `• Invesco QQQ Trust (QQQ)\n`;
        advice += `• ARK Innovation ETF (ARKK)\n`;
        advice += `• Bitcoin & Ethereum (5-10% max)`;
      }

      return { content: advice, actions: [{ label: 'Add Investment', action: 'investments' }, { label: 'Use Calculator', action: 'tools' }] };
    }

    // Savings tips
    if (lowerMessage.includes('save') || lowerMessage.includes('saving') || lowerMessage.includes('budget')) {
      const disposable = profile.monthlyIncome - profile.monthlyExpenses;
      let tips = `💰 **Personalized Savings Tips**\n\n`;
      tips += `**Your Current Situation:**\n`;
      tips += `• Income: $${profile.monthlyIncome.toLocaleString()}/month\n`;
      tips += `• Expenses: $${profile.monthlyExpenses.toLocaleString()}/month\n`;
      tips += `• Disposable: $${disposable.toLocaleString()}/month\n\n`;
      tips += `**50/30/20 Budget for You:**\n`;
      tips += `• Needs (50%): $${(profile.monthlyIncome * 0.5).toLocaleString()}\n`;
      tips += `• Wants (30%): $${(profile.monthlyIncome * 0.3).toLocaleString()}\n`;
      tips += `• Savings (20%): $${(profile.monthlyIncome * 0.2).toLocaleString()}\n\n`;
      tips += `**Action Items:**\n`;
      tips += `1. Automate $${Math.round(profile.monthlyIncome * 0.2).toLocaleString()}/month to savings\n`;
      tips += `2. Review subscriptions - cancel unused ones\n`;
      tips += `3. Use cashback apps for regular purchases\n`;
      tips += `4. Cook at home 4+ nights per week`;

      return { content: tips, actions: [{ label: 'Set Savings Goal', action: 'goals' }, { label: 'Use Budget Tool', action: 'tools' }] };
    }

    // Retirement
    if (lowerMessage.includes('retire') || lowerMessage.includes('fire') || lowerMessage.includes('401k') || lowerMessage.includes('ira')) {
      const annualIncome = profile.monthlyIncome * 12;
      const fireNumber = annualIncome * 25;
      const yearsToFire = Math.log(fireNumber / Math.max(totalInvestments, 1)) / Math.log(1.07);

      let retirement = `🏖️ **Retirement & FIRE Planning**\n\n`;
      retirement += `**Your FIRE Number:** $${fireNumber.toLocaleString()}\n`;
      retirement += `(25x your annual expenses for 4% withdrawal rate)\n\n`;
      retirement += `**Current Progress:**\n`;
      retirement += `• Invested: $${totalInvestments.toLocaleString()}\n`;
      retirement += `• Progress: ${((totalInvestments / fireNumber) * 100).toFixed(1)}%\n`;
      retirement += `• Est. Years to FIRE: ${Math.max(0, yearsToFire).toFixed(0)} years\n\n`;
      retirement += `**Recommended Actions:**\n`;
      retirement += `1. Max out 401(k): $23,000/year (2024)\n`;
      retirement += `2. Max out Roth IRA: $7,000/year\n`;
      retirement += `3. Invest additional in taxable brokerage\n`;
      retirement += `4. Aim for 15-20% of income to retirement`;

      return { content: retirement, actions: [{ label: 'FIRE Calculator', action: 'tools' }, { label: 'Add Investment', action: 'investments' }] };
    }

    // Goals
    if (lowerMessage.includes('goal')) {
      let goalsAdvice = `🎯 **Your Financial Goals**\n\n`;
      if (goals.length === 0) {
        goalsAdvice += `You haven't set any goals yet! Here are some recommended goals:\n\n`;
        goalsAdvice += `1. **Emergency Fund** - 6 months expenses ($${(profile.monthlyExpenses * 6).toLocaleString()})\n`;
        goalsAdvice += `2. **Retirement Savings** - Start with $100K milestone\n`;
        goalsAdvice += `3. **Vacation Fund** - Dream trip budget\n`;
        goalsAdvice += `4. **Debt Payoff** - If applicable`;
      } else {
        goals.forEach(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          goalsAdvice += `**${goal.name}**\n`;
          goalsAdvice += `• Progress: ${progress.toFixed(0)}% ($${goal.currentAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()})\n`;
          goalsAdvice += `• Deadline: ${new Date(goal.deadline).toLocaleDateString()}\n\n`;
        });
      }

      return { content: goalsAdvice, actions: [{ label: 'Manage Goals', action: 'goals' }] };
    }

    // Default response
    return {
      content: `I can help you with:\n\n• **"Analyze my finances"** - Get a complete overview\n• **"Investment advice"** - Personalized portfolio suggestions\n• **"How to save more"** - Budget tips and strategies\n• **"Retirement planning"** - FIRE number and 401(k) advice\n• **"My goals"** - Track and manage financial goals\n\nWhat would you like to know?`,
      actions: [
        { label: 'Analyze Finances', action: 'analyze' },
        { label: 'Investment Tips', action: 'invest' },
        { label: 'Savings Help', action: 'save' }
      ]
    };
  };

  const handleSend = (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', ...response }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAction = (action: string) => {
    if (['dashboard', 'investments', 'goals', 'tools', 'profile'].includes(action)) {
      onNavigate(action);
    } else {
      handleSend(action);
    }
  };

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
      setMessages([{
        role: 'assistant',
        content: `${greeting}${profile ? `, ${profile.name.split(' ')[0]}` : ''}! 👋\n\nI'm your AI Financial Advisor. I can analyze your finances, suggest investments based on your risk profile, help you save more, and plan for retirement.\n\nWhat would you like to know today?`,
        actions: [
          { label: '📊 Analyze My Finances', action: 'analyze my finances' },
          { label: '📈 Investment Advice', action: 'investment advice' },
          { label: '💰 How to Save More', action: 'how can I save more money' },
          { label: '🏖️ Retirement Planning', action: 'help me plan for retirement' }
        ]
      }]);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">WealthWise AI Advisor</h2>
              <p className="text-white/70 text-sm">Personalized financial guidance based on YOUR data</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'} rounded-2xl p-4`}>
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleAction(action.action)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-3 bg-slate-700 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Investments View
function InvestmentsView({
  profile,
  investments,
  onAddInvestment,
  onDeleteInvestment
}: {
  profile: UserProfile | null;
  investments: Investment[];
  onAddInvestment: () => void;
  onUpdateInvestment: (id: string, updates: Partial<Investment>) => void;
  onDeleteInvestment: (id: string) => void;
}) {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = totalValue - totalInvested;
  const returnPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const typeColors: Record<string, string> = {
    stocks: 'bg-blue-500',
    bonds: 'bg-green-500',
    etf: 'bg-purple-500',
    crypto: 'bg-orange-500',
    'real-estate': 'bg-pink-500',
    'mutual-fund': 'bg-cyan-500',
    savings: 'bg-emerald-500'
  };

  const allocationData = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const suggestions = profile ? [
    {
      name: 'S&P 500 Index Fund',
      type: 'ETF',
      risk: 'Moderate',
      expectedReturn: '8-10%',
      reason: profile.riskTolerance === 'conservative' ? 'Core holding for steady growth' : 'Foundation of any portfolio'
    },
    {
      name: profile.riskTolerance === 'aggressive' ? 'Growth Tech ETF' : 'Total Bond Market',
      type: profile.riskTolerance === 'aggressive' ? 'ETF' : 'Bonds',
      risk: profile.riskTolerance === 'aggressive' ? 'High' : 'Low',
      expectedReturn: profile.riskTolerance === 'aggressive' ? '12-15%' : '4-5%',
      reason: profile.riskTolerance === 'aggressive' ? 'High growth potential' : 'Stability and income'
    },
    {
      name: 'Real Estate Investment Trust',
      type: 'REIT',
      risk: 'Moderate',
      expectedReturn: '6-8%',
      reason: 'Diversification and passive income'
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investments</h1>
          <p className="text-slate-400">Track and manage your portfolio</p>
        </div>
        <button
          onClick={onAddInvestment}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium flex items-center gap-2"
        >
          <span>+</span> Add Investment
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <p className="text-slate-400 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <p className="text-slate-400 text-sm">Total Invested</p>
          <p className="text-2xl font-bold text-white">${totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <p className="text-slate-400 text-sm">Total Returns</p>
          <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalReturns >= 0 ? '+' : ''}${totalReturns.toLocaleString()} ({returnPercent.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Allocation & Holdings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Allocation */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Portfolio Allocation</h3>
          {Object.keys(allocationData).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(allocationData).map(([type, value]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${typeColors[type] || 'bg-slate-500'}`} />
                  <span className="text-slate-300 capitalize flex-1">{type.replace('-', ' ')}</span>
                  <span className="text-white font-medium">${value.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm w-16 text-right">
                    {((value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No investments yet</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Suggested Investments</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-medium">{suggestion.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    suggestion.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                    suggestion.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {suggestion.risk}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{suggestion.reason}</p>
                <p className="text-emerald-400 text-sm mt-1">Expected: {suggestion.expectedReturn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-semibold">Your Holdings</h3>
        </div>
        {investments.length > 0 ? (
          <div className="divide-y divide-white/5">
            {investments.map(inv => {
              const returns = inv.currentValue - inv.amount;
              const returnPct = (returns / inv.amount) * 100;
              return (
                <div key={inv.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className={`w-10 h-10 ${typeColors[inv.type] || 'bg-slate-500'} rounded-lg flex items-center justify-center text-white font-bold`}>
                    {inv.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{inv.name}</p>
                    <p className="text-slate-400 text-sm capitalize">{inv.type.replace('-', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${inv.currentValue.toLocaleString()}</p>
                    <p className={`text-sm ${returns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {returns >= 0 ? '+' : ''}${returns.toLocaleString()} ({returnPct.toFixed(1)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteInvestment(inv.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-400">No investments added yet</p>
            <button
              onClick={onAddInvestment}
              className="mt-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
            >
              Add Your First Investment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Goals View
function GoalsView({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal
}: {
  goals: Goal[];
  onAddGoal: () => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}) {
  const categoryIcons: Record<string, string> = {
    emergency: '🛡️',
    retirement: '🏖️',
    house: '🏠',
    car: '🚗',
    vacation: '✈️',
    education: '📚',
    other: '🎯'
  };

  const priorityColors: Record<string, string> = {
    high: 'text-red-400 bg-red-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    low: 'text-green-400 bg-green-500/20'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
          <p className="text-slate-400">Set, track, and achieve your financial goals</p>
        </div>
        <button
          onClick={onAddGoal}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium flex items-center gap-2"
        >
          <span>+</span> Add Goal
        </button>
      </div>

      {goals.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isComplete = goal.currentAmount >= goal.targetAmount;

            return (
              <div key={goal.id} className={`bg-slate-800/50 rounded-xl p-5 border ${isComplete ? 'border-emerald-500/50' : 'border-white/10'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                      {categoryIcons[goal.category]}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{goal.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[goal.priority]}`}>
                        {goal.priority} priority
                      </span>
                    </div>
                  </div>
                  {isComplete && <span className="text-2xl">✅</span>}
                </div>

                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">${goal.currentAmount.toLocaleString()}</span>
                  <span className="text-white">${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                  </span>
                  <span className="text-emerald-400 font-medium">{progress.toFixed(0)}%</span>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      const newAmount = prompt('Enter new current amount:', goal.currentAmount.toString());
                      if (newAmount) onUpdateGoal(goal.id, { currentAmount: parseFloat(newAmount) });
                    }}
                    className="flex-1 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                  >
                    Update Progress
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-12 border border-white/10 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-white mb-2">No goals yet</h3>
          <p className="text-slate-400 mb-6">Start by setting your first financial goal</p>
          <button
            onClick={onAddGoal}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
}

// Tools View
function ToolsView({ profile }: { profile: UserProfile | null }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Compound Interest Calculator State
  const [principal, setPrincipal] = useState(10000);
  const [monthlyAdd, setMonthlyAdd] = useState(500);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(7);

  // FIRE Calculator State
  const [fireMonthlyExpenses, setFireMonthlyExpenses] = useState(profile?.monthlyExpenses || 4000);
  const [fireCurrentInvestments, setFireCurrentInvestments] = useState(50000);
  const [fireMonthlyInvestment, setFireMonthlyInvestment] = useState(profile?.monthlySavings || 1500);
  const [fireWithdrawalRate, setFireWithdrawalRate] = useState(4);
  const [fireExpectedReturn, setFireExpectedReturn] = useState(7);
  const [fireInflationRate, setFireInflationRate] = useState(2.5);
  const [fireTargetAge, setFireTargetAge] = useState(profile?.age ? 65 - profile.age : 25);

  const calculateCompoundInterest = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const futureValue = principal * Math.pow(1 + r, n) + monthlyAdd * ((Math.pow(1 + r, n) - 1) / r);
    const totalContributed = principal + (monthlyAdd * n);
    const interestEarned = futureValue - totalContributed;
    return { futureValue, totalContributed, interestEarned };
  };

  const compoundResult = calculateCompoundInterest();

  // Enhanced FIRE Calculator
  const calculateFIRE = () => {
    const annualExpenses = fireMonthlyExpenses * 12;
    const realReturn = (fireExpectedReturn - fireInflationRate) / 100;
    const monthlyReturn = fireExpectedReturn / 100 / 12;
    
    // FIRE Number based on withdrawal rate
    const fireNumber = annualExpenses / (fireWithdrawalRate / 100);
    
    // Calculate years to FIRE
    let currentAmount = fireCurrentInvestments;
    let yearsToFire = 0;
    const maxYears = 100;
    
    while (currentAmount < fireNumber && yearsToFire < maxYears) {
      currentAmount = currentAmount * (1 + monthlyReturn) + fireMonthlyInvestment;
      yearsToFire += 1/12;
    }
    
    yearsToFire = Math.ceil(yearsToFire);
    
    // Calculate different FIRE types
    const leanFireNumber = (annualExpenses * 0.6) / (fireWithdrawalRate / 100);
    const fatFireNumber = (annualExpenses * 1.5) / (fireWithdrawalRate / 100);
    const coastFireNumber = fireNumber / Math.pow(1 + realReturn, fireTargetAge);
    
    // Progress calculations
    const progress = (fireCurrentInvestments / fireNumber) * 100;
    const leanProgress = (fireCurrentInvestments / leanFireNumber) * 100;
    const fatProgress = (fireCurrentInvestments / fatFireNumber) * 100;
    
    // Monthly income at FIRE
    const monthlyIncomeAtFire = (fireNumber * (fireWithdrawalRate / 100)) / 12;
    
    // Safe withdrawal scenarios
    const scenarios = [
      { rate: 3, years: 50, safeAmount: fireNumber * (4 / 3) },
      { rate: 3.5, years: 40, safeAmount: fireNumber * (4 / 3.5) },
      { rate: 4, years: 30, safeAmount: fireNumber },
      { rate: 4.5, years: 25, safeAmount: fireNumber * (4 / 4.5) },
    ];
    
    // Year-by-year projection
    const projections = [];
    let projectedAmount = fireCurrentInvestments;
    for (let i = 1; i <= Math.min(yearsToFire + 5, 40); i++) {
      projectedAmount = projectedAmount * (1 + fireExpectedReturn / 100) + (fireMonthlyInvestment * 12);
      projections.push({
        year: i,
        amount: Math.round(projectedAmount),
        reachedFire: projectedAmount >= fireNumber
      });
    }
    
    // Calculate FIRE age
    const currentAge = profile?.age || 30;
    const fireAge = currentAge + yearsToFire;
    
    return {
      fireNumber,
      leanFireNumber,
      fatFireNumber,
      coastFireNumber,
      yearsToFire,
      fireAge,
      currentAge,
      progress,
      leanProgress,
      fatProgress,
      monthlyIncomeAtFire,
      annualExpenses,
      scenarios,
      projections
    };
  };

  const fireResult = calculateFIRE();

  const tools = [
    { id: 'compound', name: 'Compound Interest', icon: '📈', description: 'See how your money grows over time' },
    { id: 'fire', name: 'FIRE Calculator', icon: '🔥', description: 'Complete financial independence planner' },
    { id: 'budget', name: '50/30/20 Budget', icon: '📊', description: 'Plan your monthly budget allocation' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financial Tools</h1>
        <p className="text-slate-400">Interactive calculators to help you plan</p>
      </div>

      {/* Tool Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTool === tool.id
                ? 'bg-emerald-500/20 border-emerald-500/50'
                : 'bg-slate-800/50 border-white/10 hover:bg-slate-700/50'
            }`}
          >
            <div className="text-3xl mb-2">{tool.icon}</div>
            <h3 className="text-white font-semibold">{tool.name}</h3>
            <p className="text-slate-400 text-sm">{tool.description}</p>
          </button>
        ))}
      </div>

      {/* Active Tool */}
      {activeTool === 'compound' && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Compound Interest Calculator</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-2">Initial Investment: ${principal.toLocaleString()}</label>
                <input type="range" min="0" max="100000" step="1000" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Monthly Contribution: ${monthlyAdd.toLocaleString()}</label>
                <input type="range" min="0" max="5000" step="100" value={monthlyAdd} onChange={e => setMonthlyAdd(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Years: {years}</label>
                <input type="range" min="1" max="40" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Annual Return: {rate}%</label>
                <input type="range" min="1" max="15" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-6">
              <div className="text-center mb-6">
                <p className="text-slate-400 text-sm">Future Value</p>
                <p className="text-4xl font-bold text-emerald-400">${Math.round(compoundResult.futureValue).toLocaleString()}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Contributed</span>
                  <span className="text-white">${Math.round(compoundResult.totalContributed).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Interest Earned</span>
                  <span className="text-emerald-400">${Math.round(compoundResult.interestEarned).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'fire' && (
        <div className="space-y-6">
          {/* FIRE Calculator Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-2">🔥 FIRE Calculator</h3>
              <p className="text-white/80">Financial Independence, Retire Early - Your complete path to freedom</p>
            </div>
          </div>

          {/* Main FIRE Numbers */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-orange-500/30">
              <p className="text-slate-400 text-sm mb-1">🎯 Your FIRE Number</p>
              <p className="text-3xl font-bold text-orange-400">${Math.round(fireResult.fireNumber).toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">{fireWithdrawalRate}% withdrawal rate</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">⏰ Years to FIRE</p>
              <p className="text-3xl font-bold text-white">{fireResult.yearsToFire}</p>
              <p className="text-slate-500 text-xs mt-1">At age {fireResult.fireAge}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">📈 Progress</p>
              <p className="text-3xl font-bold text-emerald-400">{Math.min(100, fireResult.progress).toFixed(1)}%</p>
              <p className="text-slate-500 text-xs mt-1">${fireCurrentInvestments.toLocaleString()} invested</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm mb-1">💰 Monthly Income at FIRE</p>
              <p className="text-3xl font-bold text-cyan-400">${Math.round(fireResult.monthlyIncomeAtFire).toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">From investments only</p>
            </div>
          </div>

          {/* Input Controls */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">📊 Customize Your Scenario</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-slate-300 text-sm mb-2">Monthly Expenses: ${fireMonthlyExpenses.toLocaleString()}</label>
                <input 
                  type="range" 
                  min="1000" 
                  max="20000" 
                  step="500" 
                  value={fireMonthlyExpenses} 
                  onChange={e => setFireMonthlyExpenses(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">Current Investments: ${fireCurrentInvestments.toLocaleString()}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1000000" 
                  step="5000" 
                  value={fireCurrentInvestments} 
                  onChange={e => setFireCurrentInvestments(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">Monthly Investment: ${fireMonthlyInvestment.toLocaleString()}</label>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100" 
                  value={fireMonthlyInvestment} 
                  onChange={e => setFireMonthlyInvestment(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">Withdrawal Rate: {fireWithdrawalRate}%</label>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  step="0.5" 
                  value={fireWithdrawalRate} 
                  onChange={e => setFireWithdrawalRate(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">Expected Return: {fireExpectedReturn}%</label>
                <input 
                  type="range" 
                  min="3" 
                  max="12" 
                  step="0.5" 
                  value={fireExpectedReturn} 
                  onChange={e => setFireExpectedReturn(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">Inflation Rate: {fireInflationRate}%</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="0.5" 
                  value={fireInflationRate} 
                  onChange={e => setFireInflationRate(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">Years to Traditional Retirement: {fireTargetAge}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="45" 
                  step="1" 
                  value={fireTargetAge} 
                  onChange={e => setFireTargetAge(Number(e.target.value))} 
                  className="w-full accent-orange-500" 
                />
              </div>
            </div>
          </div>

          {/* FIRE Types */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-green-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌱</span>
                <h4 className="text-white font-semibold">Lean FIRE</h4>
              </div>
              <p className="text-2xl font-bold text-green-400">${Math.round(fireResult.leanFireNumber).toLocaleString()}</p>
              <p className="text-slate-400 text-sm mt-1">60% of regular expenses</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-green-400">{Math.min(100, fireResult.leanProgress).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, fireResult.leanProgress)}%` }} />
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2">Minimalist lifestyle, lower expenses</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-orange-500/30 ring-2 ring-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔥</span>
                <h4 className="text-white font-semibold">Regular FIRE</h4>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Your Target</span>
              </div>
              <p className="text-2xl font-bold text-orange-400">${Math.round(fireResult.fireNumber).toLocaleString()}</p>
              <p className="text-slate-400 text-sm mt-1">Current lifestyle expenses</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-orange-400">{Math.min(100, fireResult.progress).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, fireResult.progress)}%` }} />
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2">Maintain current standard of living</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">👑</span>
                <h4 className="text-white font-semibold">Fat FIRE</h4>
              </div>
              <p className="text-2xl font-bold text-purple-400">${Math.round(fireResult.fatFireNumber).toLocaleString()}</p>
              <p className="text-slate-400 text-sm mt-1">150% of regular expenses</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-purple-400">{Math.min(100, fireResult.fatProgress).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, fireResult.fatProgress)}%` }} />
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2">Luxurious lifestyle, extra cushion</p>
            </div>
          </div>

          {/* Coast FIRE */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏖️</span>
              <div>
                <h4 className="text-white font-semibold">Coast FIRE Number</h4>
                <p className="text-slate-400 text-sm">Invest this now and never contribute again to reach FIRE by age 65</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-cyan-400">${Math.round(fireResult.coastFireNumber).toLocaleString()}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Current Age</p>
                <p className="text-white font-semibold">{fireResult.currentAge} years</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Years Until 65</p>
                <p className="text-white font-semibold">{fireTargetAge} years</p>
              </div>
            </div>
            <p className="text-emerald-400 text-sm mt-3">
              {fireCurrentInvestments >= fireResult.coastFireNumber 
                ? "✅ You've already reached Coast FIRE! You could stop contributing and still retire by 65."
                : `💡 You need $${Math.round(fireResult.coastFireNumber - fireCurrentInvestments).toLocaleString()} more to reach Coast FIRE.`}
            </p>
          </div>

          {/* Withdrawal Rate Scenarios */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">📉 Safe Withdrawal Rate Scenarios</h4>
            <div className="grid md:grid-cols-4 gap-4">
              {fireResult.scenarios.map((scenario, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-xl p-4 ${scenario.rate === fireWithdrawalRate ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-slate-700/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">{scenario.rate}%</span>
                    {scenario.rate === 4 && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Classic</span>}
                  </div>
                  <p className="text-slate-400 text-sm">~{scenario.years} year horizon</p>
                  <p className="text-white font-medium mt-2">${Math.round(scenario.safeAmount).toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">needed for FIRE</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
              <p className="text-slate-300 text-sm">
                💡 <strong>The 4% Rule:</strong> Based on the Trinity Study, withdrawing 4% of your portfolio annually has historically had a 95% success rate over 30 years. Lower rates are safer for longer retirements.
              </p>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">📊 Wealth Projection</h4>
            <div className="overflow-x-auto">
              <div className="flex items-end gap-1 h-48 min-w-[600px]">
                {fireResult.projections.slice(0, 25).map((proj, idx) => {
                  const maxAmount = Math.max(...fireResult.projections.map(p => p.amount));
                  const height = (proj.amount / maxAmount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                        Year {proj.year}: ${proj.amount.toLocaleString()}
                      </div>
                      <div 
                        className={`w-full rounded-t transition-all ${proj.reachedFire ? 'bg-gradient-to-t from-orange-500 to-amber-400' : 'bg-gradient-to-t from-emerald-600 to-cyan-500'}`}
                        style={{ height: `${height}%` }}
                      />
                      {idx % 5 === 0 && (
                        <span className="text-slate-500 text-xs mt-1">Y{proj.year}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-emerald-600 to-cyan-500 rounded" />
                  <span className="text-slate-400">Before FIRE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-amber-400 rounded" />
                  <span className="text-slate-400">FIRE Reached!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Steps */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">🚀 Your FIRE Action Plan</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xl">1️⃣</span>
                  <div>
                    <p className="text-white font-medium">Maximize Tax-Advantaged Accounts</p>
                    <p className="text-slate-400 text-sm">Max out 401(k) ($23,000) and Roth IRA ($7,000) first</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xl">2️⃣</span>
                  <div>
                    <p className="text-white font-medium">Invest in Low-Cost Index Funds</p>
                    <p className="text-slate-400 text-sm">VTI, VXUS, BND - keep expense ratios under 0.1%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xl">3️⃣</span>
                  <div>
                    <p className="text-white font-medium">Reduce Expenses</p>
                    <p className="text-slate-400 text-sm">Every $100/month saved = $30,000 less needed for FIRE</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xl">4️⃣</span>
                  <div>
                    <p className="text-white font-medium">Increase Income</p>
                    <p className="text-slate-400 text-sm">Side hustles, promotions, investments all accelerate FIRE</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xl">5️⃣</span>
                  <div>
                    <p className="text-white font-medium">Track Progress Monthly</p>
                    <p className="text-slate-400 text-sm">Update this calculator regularly to stay motivated</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <span className="text-xl">✨</span>
                  <div>
                    <p className="text-emerald-400 font-medium">Your Monthly Target</p>
                    <p className="text-white text-lg font-bold">${fireMonthlyInvestment.toLocaleString()}/month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'budget' && profile && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">50/30/20 Budget</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-500/20 rounded-xl p-4 text-center">
              <p className="text-blue-400 font-semibold">Needs (50%)</p>
              <p className="text-2xl font-bold text-white">${Math.round(profile.monthlyIncome * 0.5).toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Housing, utilities, groceries</p>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 text-center">
              <p className="text-purple-400 font-semibold">Wants (30%)</p>
              <p className="text-2xl font-bold text-white">${Math.round(profile.monthlyIncome * 0.3).toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Entertainment, dining, hobbies</p>
            </div>
            <div className="bg-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-emerald-400 font-semibold">Savings (20%)</p>
              <p className="text-2xl font-bold text-white">${Math.round(profile.monthlyIncome * 0.2).toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Investments, emergency fund</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Achievements View
function AchievementsView({ achievements }: { achievements: Array<{ id: string; name: string; description: string; icon: string; unlockedAt: string; category: string }> }) {
  const allAchievements = [
    { id: 'first_profile', name: 'Getting Started', description: 'Created your financial profile', icon: '🎯', category: 'learning' },
    { id: 'first_1k', name: 'First $1,000', description: 'Invested your first $1,000', icon: '💰', category: 'investing' },
    { id: 'first_10k', name: 'Five Figure Investor', description: 'Total investments reached $10,000', icon: '🚀', category: 'investing' },
    { id: 'first_goal', name: 'Goal Setter', description: 'Set your first financial goal', icon: '🎯', category: 'goals' },
    { id: 'emergency_fund', name: 'Safety Net', description: 'Built 6 months emergency fund', icon: '🛡️', category: 'savings' },
    { id: 'saver_20', name: 'Super Saver', description: 'Achieved 20% savings rate', icon: '💪', category: 'savings' },
  ];

  const unlockedIds = achievements.map(a => a.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-slate-400">Track your financial milestones</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.map(achievement => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const unlockData = achievements.find(a => a.id === achievement.id);

          return (
            <div
              key={achievement.id}
              className={`p-5 rounded-xl border ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50'
                  : 'bg-slate-800/50 border-white/10 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isUnlocked ? 'bg-amber-500/30' : 'bg-slate-700'
                }`}>
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div>
                  <h3 className={`font-semibold ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                    {achievement.name}
                  </h3>
                  {isUnlocked && unlockData && (
                    <p className="text-amber-400/70 text-xs">
                      {new Date(unlockData.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <p className={`text-sm ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                {achievement.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Profile Modal
function ProfileModal({
  profile,
  userName,
  userEmail,
  onSave,
  onClose
}: {
  profile: UserProfile | null;
  userName: string;
  userEmail: string;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<UserProfile>(profile || {
    name: userName,
    email: userEmail,
    age: 30,
    monthlyIncome: 5000,
    monthlySavings: 1000,
    monthlyExpenses: 3500,
    currentSavings: 10000,
    riskTolerance: 'moderate',
    investmentHorizon: 'long',
    goals: []
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">
          {profile ? 'Edit Profile' : 'Create Your Profile'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Monthly Income</label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={e => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Monthly Expenses</label>
            <input
              type="number"
              value={formData.monthlyExpenses}
              onChange={e => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Monthly Savings</label>
            <input
              type="number"
              value={formData.monthlySavings}
              onChange={e => setFormData({ ...formData, monthlySavings: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Current Total Savings</label>
            <input
              type="number"
              value={formData.currentSavings}
              onChange={e => setFormData({ ...formData, currentSavings: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Risk Tolerance</label>
            <select
              value={formData.riskTolerance}
              onChange={e => setFormData({ ...formData, riskTolerance: e.target.value as 'conservative' | 'moderate' | 'aggressive' })}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            >
              <option value="conservative">Conservative - Prefer stability</option>
              <option value="moderate">Moderate - Balanced approach</option>
              <option value="aggressive">Aggressive - Higher risk for higher returns</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Investment Horizon</label>
            <select
              value={formData.investmentHorizon}
              onChange={e => setFormData({ ...formData, investmentHorizon: e.target.value as 'short' | 'medium' | 'long' })}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            >
              <option value="short">Short-term (1-3 years)</option>
              <option value="medium">Medium-term (3-7 years)</option>
              <option value="long">Long-term (7+ years)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {profile && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Investment Modal
function InvestmentModal({
  onSave,
  onClose
}: {
  onSave: (investment: { name: string; type: Investment['type']; amount: number; currentValue: number; returns: number }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Investment['type']>('stocks');
  const [amount, setAmount] = useState(1000);
  const [currentValue, setCurrentValue] = useState(1000);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Add Investment</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Investment Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Vanguard S&P 500 ETF"
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as Investment['type'])}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            >
              <option value="stocks">Stocks</option>
              <option value="bonds">Bonds</option>
              <option value="etf">ETF</option>
              <option value="mutual-fund">Mutual Fund</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="real-estate">Real Estate</option>
              <option value="savings">High-Yield Savings</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Amount Invested</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Current Value</label>
            <input
              type="number"
              value={currentValue}
              onChange={e => setCurrentValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ name, type, amount, currentValue, returns: currentValue - amount });
              }
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium"
          >
            Add Investment
          </button>
        </div>
      </div>
    </div>
  );
}

// Goal Modal
function GoalModal({
  onSave,
  onClose
}: {
  onSave: (goal: Omit<Goal, 'id'>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState(10000);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [category, setCategory] = useState<Goal['category']>('other');
  const [priority, setPriority] = useState<Goal['priority']>('medium');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Add Financial Goal</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Emergency Fund"
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Goal['category'])}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            >
              <option value="emergency">Emergency Fund</option>
              <option value="retirement">Retirement</option>
              <option value="house">House Down Payment</option>
              <option value="car">Car</option>
              <option value="vacation">Vacation</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1">Target Amount</label>
              <input
                type="number"
                value={targetAmount}
                onChange={e => setTargetAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1">Current Amount</label>
              <input
                type="number"
                value={currentAmount}
                onChange={e => setCurrentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Target Date</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Goal['priority'])}
              className="w-full px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ name, targetAmount, currentAmount, deadline, category, priority });
              }
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium"
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}

// Debug Panel Component
function DebugPanel({
  user,
  userData,
  isOnline,
  onClose
}: {
  user: { id: string; email: string; name: string } | null;
  userData: { profile: UserProfile | null; investments: Investment[]; goals: Goal[]; achievements: Array<{ id: string; name: string; description: string; icon: string; unlockedAt: string; category: string }> };
  isOnline: boolean;
  onClose: () => void;
}) {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const runConnectionTest = async () => {
    setTestStatus('testing');
    setTestMessage('Testing connection to Supabase...');

    try {
      // Import supabase dynamically to test
      const { supabase, isSupabaseConfigured } = await import('./lib/supabase');
      
      if (!isSupabaseConfigured()) {
        setTestStatus('error');
        setTestMessage('Supabase is not configured. Using localStorage mode.');
        return;
      }

      // Try to read from database
      const { error } = await supabase.from('user_data').select('count').limit(1);
      
      if (error) {
        setTestStatus('error');
        setTestMessage(`Database error: ${error.message}. Make sure you created the table in Supabase.`);
      } else {
        setTestStatus('success');
        setTestMessage('✅ Connected to Supabase successfully! Your data is being saved to the cloud.');
      }
    } catch (e) {
      setTestStatus('error');
      setTestMessage(`Connection failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🔧 System Status & Debug
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Connection Status */}
        <div className={`p-4 rounded-xl mb-6 ${isOnline ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <h3 className={`font-semibold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isOnline ? '☁️ Cloud Mode (Supabase)' : '💾 Local Mode (Browser Storage)'}
              </h3>
              <p className="text-slate-300 text-sm">
                {isOnline 
                  ? 'Your data is saved to the cloud and accessible from any device.' 
                  : 'Data is stored locally in your browser. Set up Supabase for cloud storage.'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Connection Button */}
        <div className="mb-6">
          <button
            onClick={runConnectionTest}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {testStatus === 'testing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>🧪 Test Database Connection</>
            )}
          </button>
          
          {testMessage && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              testStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              testStatus === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {testMessage}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <h4 className="text-white font-semibold mb-3">👤 Current User</h4>
          {user ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <span className="text-white font-mono text-xs">{user.id.slice(0, 20)}...</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Not logged in</p>
          )}
        </div>

        {/* Data Summary */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <h4 className="text-white font-semibold mb-3">📊 Saved Data Summary</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-600/50 rounded-lg p-3">
              <p className="text-slate-400">Profile</p>
              <p className={`font-semibold ${userData.profile ? 'text-emerald-400' : 'text-slate-500'}`}>
                {userData.profile ? '✅ Created' : '❌ Not set'}
              </p>
            </div>
            <div className="bg-slate-600/50 rounded-lg p-3">
              <p className="text-slate-400">Investments</p>
              <p className="text-white font-semibold">{userData.investments.length} items</p>
            </div>
            <div className="bg-slate-600/50 rounded-lg p-3">
              <p className="text-slate-400">Goals</p>
              <p className="text-white font-semibold">{userData.goals.length} items</p>
            </div>
            <div className="bg-slate-600/50 rounded-lg p-3">
              <p className="text-slate-400">Achievements</p>
              <p className="text-white font-semibold">{userData.achievements.length} unlocked</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        {userData.profile && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
            <h4 className="text-white font-semibold mb-3">💰 Profile Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Income:</span>
                <span className="text-emerald-400">${userData.profile.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Expenses:</span>
                <span className="text-red-400">${userData.profile.monthlyExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Savings:</span>
                <span className="text-cyan-400">${userData.profile.currentSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Tolerance:</span>
                <span className="text-white capitalize">{userData.profile.riskTolerance}</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h4 className="text-blue-400 font-semibold mb-2">📝 How to Test</h4>
          <ol className="text-slate-300 text-sm space-y-2">
            <li>1. <strong>Click "Test Database Connection"</strong> above to verify Supabase is connected</li>
            <li>2. <strong>Create your profile</strong> by filling out the form</li>
            <li>3. <strong>Add some investments and goals</strong> to test data saving</li>
            <li>4. <strong>Sign out and sign back in</strong> - your data should still be there</li>
            <li>5. <strong>Try from a different browser/device</strong> - same account, same data!</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
