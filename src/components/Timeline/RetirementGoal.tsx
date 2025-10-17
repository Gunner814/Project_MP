import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';

export default function RetirementGoal() {
  const { retirementGoal, setRetirementGoal, projections, financial } = useTimelineStore();

  // Local state for form inputs
  const [targetAge, setTargetAge] = useState(retirementGoal?.targetAge || 65);
  const [monthlyIncomeNeeded, setMonthlyIncomeNeeded] = useState(
    retirementGoal?.monthlyIncomeNeeded || 4000
  );
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>(
    retirementGoal?.riskTolerance || 'moderate'
  );

  // Calculate required nest egg using 4% rule adjusted for risk
  // Conservative: 3% withdrawal rate, Moderate: 4%, Aggressive: 5%
  const withdrawalRates = {
    conservative: 0.03,
    moderate: 0.04,
    aggressive: 0.05,
  };

  const annualIncomeNeeded = monthlyIncomeNeeded * 12;
  const requiredNestEgg = annualIncomeNeeded / withdrawalRates[riskTolerance];

  // Get projection at target retirement age
  const retirementProjection = projections.find(p => p.age === targetAge);
  const currentProjection = retirementProjection?.netWorth || 0;

  // Calculate gap
  const gap = requiredNestEgg - currentProjection;
  const percentageToGoal = (currentProjection / requiredNestEgg) * 100;
  const isOnTrack = gap <= 0;

  // Determine status color
  const getStatusColor = () => {
    if (percentageToGoal >= 100) return 'text-money-positive';
    if (percentageToGoal >= 75) return 'text-accent-info';
    if (percentageToGoal >= 50) return 'text-accent-warning';
    return 'text-accent-error';
  };

  const getStatusMessage = () => {
    if (percentageToGoal >= 100) return '🎉 You\'re on track!';
    if (percentageToGoal >= 75) return '✅ Good progress';
    if (percentageToGoal >= 50) return '⚠️ Needs attention';
    return '🚨 Significant gap';
  };

  // Save to store when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      setRetirementGoal({
        targetAge,
        monthlyIncomeNeeded,
        riskTolerance,
        requiredNestEgg,
      });
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [targetAge, monthlyIncomeNeeded, riskTolerance, requiredNestEgg, setRetirementGoal]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const yearsUntilRetirement = targetAge - financial.currentAge;

  return (
    <div className="bg-bg-secondary p-4 rounded-lg border-2 border-accent-success">
      <h3 className="text-lg text-accent-success mb-4 flex items-center gap-2 font-semibold">
        <Target className="w-5 h-5" />
        Retirement Goal
      </h3>

      <div className="space-y-4">
        {/* Target Retirement Age */}
        <div>
          <label className="block text-sm text-text-primary mb-2 font-semibold">
            Target Retirement Age
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="55"
              max="75"
              step="1"
              value={targetAge}
              onChange={(e) => setTargetAge(Number(e.target.value))}
              className="flex-1 accent-accent-success"
            />
            <div className="w-20 text-right">
              <input
                type="number"
                value={targetAge}
                onChange={(e) => setTargetAge(Number(e.target.value))}
                className="w-full bg-bg-tertiary text-accent-success px-2 py-1 rounded border-2 border-border-primary text-sm focus:outline-none focus:border-accent-success"
                min="55"
                max="75"
              />
            </div>
          </div>
          <div className="text-xs text-text-muted mt-1">
            {yearsUntilRetirement > 0
              ? `${yearsUntilRetirement} years from now`
              : 'Already retired'}
          </div>
        </div>

        {/* Monthly Income Needed */}
        <div>
          <label className="block text-sm text-text-primary mb-2 font-semibold">
            Monthly Income Needed in Retirement
          </label>
          <input
            type="number"
            value={monthlyIncomeNeeded}
            onChange={(e) => setMonthlyIncomeNeeded(Number(e.target.value))}
            className="w-full bg-bg-tertiary text-money-positive text-lg px-3 py-2 rounded border-2 border-border-primary focus:outline-none focus:border-accent-success"
            placeholder="4000"
            step="500"
          />
          <div className="text-xs text-text-muted mt-1">
            Recommended: 60-80% of current income ({formatCurrency(financial.monthlyIncome * 0.7)})
          </div>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="block text-sm text-text-primary mb-2 font-semibold">
            Investment Strategy
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setRiskTolerance('conservative')}
              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                riskTolerance === 'conservative'
                  ? 'border-accent-success bg-accent-success bg-opacity-20 text-accent-success font-bold'
                  : 'border-border-primary bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
              }`}
            >
              <div className="font-semibold">Conservative</div>
              <div className="text-xs opacity-70">3% withdrawal</div>
            </button>
            <button
              onClick={() => setRiskTolerance('moderate')}
              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                riskTolerance === 'moderate'
                  ? 'border-accent-success bg-accent-success bg-opacity-20 text-accent-success font-bold'
                  : 'border-border-primary bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
              }`}
            >
              <div className="font-semibold">Moderate</div>
              <div className="text-xs opacity-70">4% withdrawal</div>
            </button>
            <button
              onClick={() => setRiskTolerance('aggressive')}
              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                riskTolerance === 'aggressive'
                  ? 'border-accent-success bg-accent-success bg-opacity-20 text-accent-success font-bold'
                  : 'border-border-primary bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
              }`}
            >
              <div className="font-semibold">Aggressive</div>
              <div className="text-xs opacity-70">5% withdrawal</div>
            </button>
          </div>
          <div className="text-xs text-text-muted mt-2">
            Based on safe withdrawal rate. Conservative = lower risk, higher nest egg needed.
          </div>
        </div>

        {/* Results Summary */}
        <motion.div
          className="mt-6 p-4 bg-bg-tertiary rounded-lg border-2 border-border-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm text-accent-success mb-3 flex items-center gap-2 font-semibold">
            <TrendingUp className="w-4 h-4" />
            Retirement Readiness
          </h4>

          <div className="space-y-3">
            {/* Required Nest Egg */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-text-muted">Required Nest Egg:</span>
              <span className="text-accent-success font-bold text-lg">
                {formatCurrency(requiredNestEgg)}
              </span>
            </div>

            {/* Current Projection */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-text-muted">Projected at Age {targetAge}:</span>
              <span className="text-text-primary font-semibold">
                {formatCurrency(currentProjection)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Progress:</span>
                <span className={`font-bold ${getStatusColor()}`}>
                  {Math.min(percentageToGoal, 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-bg-hover rounded-full h-3 overflow-hidden border border-border-primary">
                <motion.div
                  className={`h-full ${
                    percentageToGoal >= 100
                      ? 'bg-money-positive'
                      : percentageToGoal >= 75
                      ? 'bg-accent-info'
                      : percentageToGoal >= 50
                      ? 'bg-accent-warning'
                      : 'bg-accent-error'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentageToGoal, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
            </div>

            {/* Gap/Surplus */}
            {isOnTrack ? (
              <div className="flex items-center gap-2 p-3 bg-money-positive bg-opacity-10 rounded-lg border border-money-positive">
                <CheckCircle className="w-5 h-5 text-money-positive flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-money-positive">
                    {getStatusMessage()}
                  </div>
                  <div className="text-xs text-text-muted">
                    Surplus: {formatCurrency(Math.abs(gap))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-accent-warning bg-opacity-10 rounded-lg border border-accent-warning">
                <AlertTriangle className="w-5 h-5 text-accent-warning flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-accent-warning">
                    {getStatusMessage()}
                  </div>
                  <div className="text-xs text-text-muted">
                    Gap: {formatCurrency(gap)} to reach goal
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {!isOnTrack && gap > 0 && (
              <div className="p-3 bg-bg-hover rounded-lg border border-border-primary">
                <div className="text-xs text-text-primary font-semibold mb-2">
                  💡 To close the gap:
                </div>
                <ul className="space-y-1 text-xs text-text-secondary">
                  <li>
                    • Save extra {formatCurrency(gap / (yearsUntilRetirement * 12))}/month
                  </li>
                  <li>
                    • Or delay retirement by {Math.ceil(gap / (currentProjection / yearsUntilRetirement))} years
                  </li>
                  <li>
                    • Or reduce monthly income need to {formatCurrency(currentProjection * withdrawalRates[riskTolerance] / 12)}/month
                  </li>
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
