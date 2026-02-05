export interface UserProfile {
  name: string;
  email: string;
  age: number;
  monthlyIncome: number;
  monthlySavings: number;
  monthlyExpenses: number;
  currentSavings: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long';
  goals: string[];
}

export interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'etf' | 'crypto' | 'real-estate' | 'mutual-fund' | 'savings';
  amount: number;
  currentValue: number;
  returns: number;
  purchaseDate?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'emergency' | 'retirement' | 'house' | 'car' | 'vacation' | 'education' | 'other';
  priority: 'high' | 'medium' | 'low';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: string;
}

export interface ProgressEntry {
  id: string;
  date: string;
  totalSavings: number;
  totalInvestments: number;
  netWorth: number;
}

export interface HealthScore {
  overall: number;
  savings: number;
  emergency: number;
  debt: number;
  investing: number;
  goals: number;
}
