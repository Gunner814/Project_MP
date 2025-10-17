import { Link } from 'react-router-dom';
import {
  DollarSign,
  Clock,
  Target,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  PiggyBank,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import useTimelineStore from '@/stores/timelineStore';

export default function Dashboard() {
  const { financial, retirementGoal, projections } = useTimelineStore();

  // This would come from localStorage or API
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const hasProfile = Object.keys(userProfile).length > 0;

  // Calculate retirement readiness
  const retirementAge = retirementGoal?.targetAge || 65;
  const requiredNestEgg = retirementGoal?.requiredNestEgg || 1000000;
  const retirementProjection = projections.find(p => p.age === retirementAge);
  const currentProjection = retirementProjection?.netWorth || 0;
  const percentageToGoal = requiredNestEgg > 0 ? (currentProjection / requiredNestEgg) * 100 : 0;
  const yearsToRetirement = retirementAge - financial.currentAge;

  const getRetirementStatus = () => {
    if (percentageToGoal >= 100) return { color: 'green', icon: CheckCircle, message: 'On Track!', detail: 'You\'re projected to meet your retirement goal' };
    if (percentageToGoal >= 75) return { color: 'blue', icon: Info, message: 'Good Progress', detail: 'You\'re mostly on track, but consider saving more' };
    if (percentageToGoal >= 50) return { color: 'yellow', icon: AlertCircle, message: 'Needs Attention', detail: 'Significant adjustments needed to meet your goal' };
    return { color: 'red', icon: AlertTriangle, message: 'Action Required', detail: 'You\'re significantly behind your retirement target' };
  };

  const retirementStatus = getRetirementStatus();

  // Calculate financial health
  const savingsRate = financial?.savingsRate || 0;
  const isSavingEnough = savingsRate >= 20;
  const discretionarySpending = (financial?.monthlyIncome || 0) - (financial?.monthlySavings || 0);
  const emergencyFundMonths = discretionarySpending > 0
    ? (financial?.cashSavings || 0) / discretionarySpending
    : 0;
  const hasEmergencyFund = emergencyFundMonths >= 6;

  // Detect timeline warnings
  const warnings: Array<{ age: number; message: string; severity: 'high' | 'medium' | 'low' }> = [];

  // Check for cash depletion
  projections.forEach(p => {
    if (p.cashSavings < 0) {
      warnings.push({
        age: p.age,
        message: `Cash depleted - negative balance of $${Math.abs(p.cashSavings).toLocaleString()}`,
        severity: 'high'
      });
    } else if (p.cashSavings < financial.monthlyIncome * 3 && p.age > financial.currentAge) {
      warnings.push({
        age: p.age,
        message: `Low cash reserves - only $${p.cashSavings.toLocaleString()} remaining`,
        severity: 'medium'
      });
    }
  });

  // Check for high expense years
  projections.forEach((p, index) => {
    if (index > 0 && p.annualExpenses > financial.monthlyIncome * 24) {
      warnings.push({
        age: p.age,
        message: `High expenses year - $${p.annualExpenses.toLocaleString()} (2x annual income)`,
        severity: 'medium'
      });
    }
  });

  // Deduplicate warnings (only show first warning per age)
  const uniqueWarnings = warnings.reduce((acc, warning) => {
    if (!acc.find(w => w.age === warning.age)) {
      acc.push(warning);
    }
    return acc;
  }, [] as typeof warnings).slice(0, 5); // Show max 5 warnings

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-chalk text-chalk-yellow mb-2">
            Welcome to Your Life Journey
          </h1>
          <p className="text-xl font-casual text-chalk-white">
            Plan, visualize, and achieve your Singapore dreams
          </p>
        </div>

        {/* Profile Alert */}
        {!hasProfile && (
          <div className="chalk-card bg-board-light mb-8 border-chalk-yellow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-chalk text-chalk-yellow mb-2">
                  Start Your Journey
                </h3>
                <p className="font-casual text-chalk-white">
                  Create your financial profile to get personalized recommendations
                </p>
              </div>
              <Link
                to="/profile"
                className="chalk-button flex items-center gap-2"
              >
                Create Profile
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Retirement Readiness - Hero Section */}
        {hasProfile && retirementGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-6 rounded-lg border-4 ${
              retirementStatus.color === 'green' ? 'border-chalk-green bg-chalk-green bg-opacity-10' :
              retirementStatus.color === 'blue' ? 'border-chalk-blue bg-chalk-blue bg-opacity-10' :
              retirementStatus.color === 'yellow' ? 'border-chalk-yellow bg-chalk-yellow bg-opacity-10' :
              'border-chalk-red bg-chalk-red bg-opacity-10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-lg ${
                retirementStatus.color === 'green' ? 'bg-chalk-green' :
                retirementStatus.color === 'blue' ? 'bg-chalk-blue' :
                retirementStatus.color === 'yellow' ? 'bg-chalk-yellow' :
                'bg-chalk-red'
              }`}>
                <retirementStatus.icon className="w-12 h-12 text-board" />
              </div>
              <div className="flex-1">
                <h2 className={`text-3xl font-chalk mb-2 ${
                  retirementStatus.color === 'green' ? 'text-chalk-green' :
                  retirementStatus.color === 'blue' ? 'text-chalk-blue' :
                  retirementStatus.color === 'yellow' ? 'text-chalk-yellow' :
                  'text-chalk-red'
                }`}>
                  Retirement Readiness: {retirementStatus.message}
                </h2>
                <p className="text-lg font-casual text-chalk-white mb-4">
                  {retirementStatus.detail}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-casual text-chalk-white opacity-70">Progress to Goal</div>
                    <div className="text-2xl font-chalk text-chalk-yellow">{Math.min(percentageToGoal, 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-casual text-chalk-white opacity-70">Required Nest Egg</div>
                    <div className="text-2xl font-chalk text-chalk-yellow">{formatCurrency(requiredNestEgg)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-casual text-chalk-white opacity-70">Years to Retirement</div>
                    <div className="text-2xl font-chalk text-chalk-yellow">{yearsToRetirement > 0 ? yearsToRetirement : 'Retired'}</div>
                  </div>
                </div>
                <Link to="/timeline" className="inline-flex items-center gap-2 mt-4 chalk-button">
                  Adjust Your Plan
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Health & Timeline Health Check Grid */}
        {hasProfile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Financial Health */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="chalk-card"
            >
              <h3 className="text-2xl font-chalk text-chalk-yellow mb-4 flex items-center gap-2">
                <PiggyBank className="w-6 h-6" />
                Financial Health
              </h3>
              <div className="space-y-4">
                {/* Savings Rate */}
                <div className="flex items-center justify-between p-3 bg-board-light rounded">
                  <div className="flex items-center gap-2">
                    <Target className={`w-5 h-5 ${isSavingEnough ? 'text-chalk-green' : 'text-chalk-red'}`} />
                    <span className="font-casual text-chalk-white">Savings Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-chalk ${isSavingEnough ? 'text-chalk-green' : 'text-chalk-red'}`}>
                      {savingsRate.toFixed(1)}%
                    </span>
                    {isSavingEnough ? (
                      <CheckCircle className="w-5 h-5 text-chalk-green" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-chalk-red" />
                    )}
                  </div>
                </div>

                {/* Emergency Fund */}
                <div className="flex items-center justify-between p-3 bg-board-light rounded">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-5 h-5 ${hasEmergencyFund ? 'text-chalk-green' : 'text-chalk-yellow'}`} />
                    <span className="font-casual text-chalk-white">Emergency Fund</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-chalk ${hasEmergencyFund ? 'text-chalk-green' : 'text-chalk-yellow'}`}>
                      {emergencyFundMonths.toFixed(1)} months
                    </span>
                    {hasEmergencyFund ? (
                      <CheckCircle className="w-5 h-5 text-chalk-green" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-chalk-yellow" />
                    )}
                  </div>
                </div>

                {/* Current Net Worth */}
                <div className="flex items-center justify-between p-3 bg-board-light rounded">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-chalk-blue" />
                    <span className="font-casual text-chalk-white">Current Net Worth</span>
                  </div>
                  <span className="text-lg font-chalk text-chalk-yellow">
                    {formatCurrency(financial.netWorth)}
                  </span>
                </div>

                {/* Recommendations */}
                <div className="p-3 bg-board-dark rounded border border-chalk-blue">
                  <div className="text-sm font-casual text-chalk-white">
                    {!isSavingEnough && (
                      <div className="mb-2">⚠️ Increase savings rate to 20% minimum</div>
                    )}
                    {!hasEmergencyFund && (
                      <div className="mb-2">💡 Build 6-month emergency fund</div>
                    )}
                    {isSavingEnough && hasEmergencyFund && (
                      <div>✅ Your financial health is strong!</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timeline Health Check */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="chalk-card"
            >
              <h3 className="text-2xl font-chalk text-chalk-yellow mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Timeline Health Check
              </h3>
              {uniqueWarnings.length > 0 ? (
                <div className="space-y-3">
                  {uniqueWarnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border-l-4 ${
                        warning.severity === 'high' ? 'bg-chalk-red bg-opacity-10 border-chalk-red' :
                        warning.severity === 'medium' ? 'bg-chalk-yellow bg-opacity-10 border-chalk-yellow' :
                        'bg-chalk-blue bg-opacity-10 border-chalk-blue'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          warning.severity === 'high' ? 'text-chalk-red' :
                          warning.severity === 'medium' ? 'text-chalk-yellow' :
                          'text-chalk-blue'
                        }`} />
                        <div className="flex-1">
                          <div className="font-chalk text-chalk-white">Age {warning.age}</div>
                          <div className="text-sm font-casual text-chalk-white opacity-90">
                            {warning.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link to="/timeline" className="inline-flex items-center gap-2 mt-2 text-chalk-blue font-casual hover:text-chalk-yellow transition-colors">
                    Review Timeline
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-chalk-green mx-auto mb-4" />
                  <p className="font-chalk text-chalk-green text-xl mb-2">
                    All Clear!
                  </p>
                  <p className="font-casual text-chalk-white">
                    No warnings detected in your timeline
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Call to Action - Go to Timeline */}
        {hasProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link
              to="/timeline"
              className="inline-flex items-center gap-3 px-8 py-4 bg-chalk-yellow text-board font-chalk text-2xl rounded-lg hover:bg-opacity-90 transition-all hover:scale-105 shadow-2xl"
            >
              <Clock className="w-8 h-8" />
              Open Interactive Timeline
              <ChevronRight className="w-8 h-8" />
            </Link>
            <p className="mt-4 text-chalk-white font-casual">
              Drag & drop life events, adjust income, see your financial future unfold
            </p>
          </motion.div>
        )}

        {/* Tips Section */}
        <div className="mt-12 p-6 border-2 border-chalk-yellow border-dashed rounded-lg">
          <h2 className="text-2xl font-chalk text-chalk-yellow mb-4">
            Quick Tips for Singaporeans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-chalk-white font-casual">
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>Top up CPF SA to get $8,000 tax relief</span>
            </div>
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>BTO first, upgrade later for best value</span>
            </div>
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>Aim for 20% minimum savings rate</span>
            </div>
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>Use SRS for tax deferral if high income</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}