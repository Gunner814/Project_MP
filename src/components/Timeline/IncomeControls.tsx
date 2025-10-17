import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Calculator, TrendingUp, Briefcase } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';

export default function IncomeControls() {
  const {
    financial,
    updateIncome,
    updateSalaryGrowthRate,
    updateStartingCapital,
    calculateProjections,
    timelineModules,
  } = useTimelineStore();

  // Starting capital state
  const [cashSavings, setCashSavings] = useState(financial.cashSavings);
  const [cpfOA, setCpfOA] = useState(financial.cpfBalances.ordinary);
  const [cpfSA, setCpfSA] = useState(financial.cpfBalances.special);
  const [cpfMA, setCpfMA] = useState(financial.cpfBalances.medisave);
  const [investments, setInvestments] = useState(financial.investments);
  const [salaryGrowthRate, setSalaryGrowthRate] = useState(financial.salaryGrowthRate);

  useEffect(() => {
    setCashSavings(financial.cashSavings);
    setCpfOA(financial.cpfBalances.ordinary);
    setCpfSA(financial.cpfBalances.special);
    setCpfMA(financial.cpfBalances.medisave);
    setInvestments(financial.investments);
    setSalaryGrowthRate(financial.salaryGrowthRate);
  }, [financial]);

  const handleCapitalUpdate = () => {
    updateStartingCapital({
      cashSavings,
      cpfOA,
      cpfSA,
      cpfMA,
      investments,
    });
    calculateProjections();
  };

  const handleGrowthRateUpdate = () => {
    updateSalaryGrowthRate(salaryGrowthRate);
    calculateProjections();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCPF = cpfOA + cpfSA + cpfMA;
  const totalNetWorth = cashSavings + totalCPF + investments;

  // Count job modules on timeline
  const jobModules = timelineModules.filter(m => m.type === 'career' || m.type === 'retirement');
  const hasStartingJob = jobModules.some(m => m.id.includes('starting-job'));

  return (
    <div className="bg-bg-secondary p-4 rounded-lg border-2 border-accent-warning">
      <h3 className="text-lg text-accent-warning mb-4 flex items-center gap-2 font-semibold">
        <PiggyBank className="w-5 h-5" />
        Starting Capital
      </h3>

      <div className="space-y-4">
        {/* Cash Savings */}
        <div>
          <label className="block text-sm text-text-primary mb-2 font-semibold">
            Cash Savings
          </label>
          <input
            type="number"
            value={cashSavings}
            onChange={(e) => setCashSavings(Number(e.target.value))}
            onBlur={handleCapitalUpdate}
            className="w-full bg-bg-tertiary text-money-positive text-lg px-3 py-2 rounded border-2 border-border-primary focus:outline-none focus:border-accent-primary"
            placeholder="20000"
          />
          <div className="text-xs text-text-muted mt-1">
            Bank accounts, liquid cash
          </div>
        </div>

        {/* CPF Balances */}
        <div className="space-y-2">
          <label className="block text-sm text-text-primary font-semibold">
            CPF Balances
          </label>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-text-muted">OA</label>
              <input
                type="number"
                value={cpfOA}
                onChange={(e) => setCpfOA(Number(e.target.value))}
                onBlur={handleCapitalUpdate}
                className="w-full bg-bg-tertiary text-accent-info px-2 py-1 rounded border-2 border-border-primary text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">SA</label>
              <input
                type="number"
                value={cpfSA}
                onChange={(e) => setCpfSA(Number(e.target.value))}
                onBlur={handleCapitalUpdate}
                className="w-full bg-bg-tertiary text-accent-info px-2 py-1 rounded border-2 border-border-primary text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">MA</label>
              <input
                type="number"
                value={cpfMA}
                onChange={(e) => setCpfMA(Number(e.target.value))}
                onBlur={handleCapitalUpdate}
                className="w-full bg-bg-tertiary text-accent-info px-2 py-1 rounded border-2 border-border-primary text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>
          <div className="text-xs text-text-muted">
            Total CPF: {formatCurrency(totalCPF)}
          </div>
        </div>

        {/* Investments */}
        <div>
          <label className="block text-sm text-text-primary mb-2 font-semibold">
            Investments
          </label>
          <input
            type="number"
            value={investments}
            onChange={(e) => setInvestments(Number(e.target.value))}
            onBlur={handleCapitalUpdate}
            className="w-full bg-bg-tertiary text-money-positive text-lg px-3 py-2 rounded border-2 border-border-primary focus:outline-none focus:border-accent-primary"
            placeholder="10000"
          />
          <div className="text-xs text-text-muted mt-1">
            Stocks, bonds, crypto, etc.
          </div>
        </div>

        {/* Salary Growth Rate */}
        <div>
          <label className="block text-sm text-text-primary mb-2 font-semibold">
            Annual Salary Growth
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={salaryGrowthRate}
              onChange={(e) => setSalaryGrowthRate(Number(e.target.value))}
              onMouseUp={handleGrowthRateUpdate}
              onTouchEnd={handleGrowthRateUpdate}
              className="flex-1 accent-accent-primary"
            />
            <div className="w-20 text-right">
              <input
                type="number"
                value={salaryGrowthRate}
                onChange={(e) => setSalaryGrowthRate(Number(e.target.value))}
                onBlur={handleGrowthRateUpdate}
                className="w-full bg-bg-tertiary text-accent-info px-2 py-1 rounded border-2 border-border-primary text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>
          <div className="text-xs text-text-muted mt-1">
            {salaryGrowthRate}% increase per year
          </div>
        </div>
      </div>

      {/* Net Worth Summary */}
      <motion.div
        className="mt-6 p-3 bg-bg-tertiary rounded-lg border-2 border-border-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-sm text-accent-warning mb-3 flex items-center gap-2 font-semibold">
          <Calculator className="w-4 h-4" />
          Current Net Worth
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Cash:</span>
            <span className="text-money-positive font-semibold">
              {formatCurrency(cashSavings)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">CPF Total:</span>
            <span className="text-accent-info font-semibold">
              {formatCurrency(totalCPF)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">Investments:</span>
            <span className="text-money-positive font-semibold">
              {formatCurrency(investments)}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t-2 border-border-primary">
            <span className="text-accent-warning font-bold">Total Net Worth:</span>
            <span className="text-accent-warning font-bold text-lg">
              {formatCurrency(totalNetWorth)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Job Module Reminder */}
      {!hasStartingJob && (
        <motion.div
          className="mt-4 p-3 bg-accent-warning bg-opacity-10 rounded-lg border-2 border-accent-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-accent-warning mt-0.5 flex-shrink-0" />
            <div className="text-xs text-accent-warning">
              <p className="font-bold mb-1">Add Job Module!</p>
              <p className="opacity-90">
                Drag "Starting Job" from the library to your timeline to set your income.
                Job changes, promotions, and side hustles are all timeline modules now!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
