import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calculator, Info } from 'lucide-react';
import { TimelineModule } from '@/stores/timelineStore';
import useTimelineStore from '@/stores/timelineStore';

interface ModuleCustomizationDialogProps {
  module: TimelineModule;
  age: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customizedModule: TimelineModule) => void;
}

export default function ModuleCustomizationDialog({
  module,
  age,
  isOpen,
  onClose,
  onConfirm
}: ModuleCustomizationDialogProps) {
  const { financial } = useTimelineStore();
  const currentYear = new Date().getFullYear();
  const calculatedYear = currentYear + (age - financial.currentAge);

  // Initialize with module defaults
  const [customModule, setCustomModule] = useState<TimelineModule>({
    ...module,
    age,
    year: calculatedYear,
  });

  // Housing specific state
  const [cpfUsage, setCpfUsage] = useState(80); // Default 80% CPF for housing
  const [grants, setGrants] = useState({
    enhanced: module.type === 'house' && module.id.includes('bto') ? 80000 : 0,
    proximity: 0,
    singles: 0,
  });

  const [loanDetails, setLoanDetails] = useState({
    downpayment: module.costs?.oneTime || 0,
    loanAmount: (module.costs?.oneTime || 0) * 3, // Assume 25% downpayment
    interestRate: 2.6, // HDB loan rate
    loanTenure: 25, // years
  });

  // Reset state when module or age changes
  useEffect(() => {
    if (isOpen) {
      const newYear = currentYear + (age - financial.currentAge);
      setCustomModule({
        ...module,
        age,
        year: newYear,
      });
      setCpfUsage(80);
      setGrants({
        enhanced: module.type === 'house' && module.id.includes('bto') ? 80000 : 0,
        proximity: 0,
        singles: 0,
      });
      setLoanDetails({
        downpayment: module.costs?.oneTime || 0,
        loanAmount: (module.costs?.oneTime || 0) * 3,
        interestRate: 2.6,
        loanTenure: 25,
      });
    }
  }, [module, age, isOpen, currentYear, financial.currentAge]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    const principal = loanDetails.loanAmount;
    const monthlyRate = loanDetails.interestRate / 100 / 12;
    const months = loanDetails.loanTenure * 12;

    if (monthlyRate === 0) return principal / months;

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                   (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(payment);
  };

  const handleConfirm = () => {
    const totalGrants = Object.values(grants).reduce((a, b) => a + b, 0);
    const effectiveOneTime = Math.max(0, (customModule.costs?.oneTime || 0) - totalGrants);

    const finalModule: TimelineModule = {
      ...customModule,
      costs: {
        ...customModule.costs,
        oneTime: effectiveOneTime,
        monthly: module.type === 'house' ? calculateMonthlyPayment() : customModule.costs?.monthly,
        cpfUsage: module.type === 'house' ? cpfUsage : 0,
        grants: totalGrants,
      }
    };

    onConfirm(finalModule);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="backdrop-blur-xl bg-bg-secondary/95 rounded-lg shadow-2xl border-2 border-accent-primary
                       p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{module.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{module.name}</h2>
                  <p className="text-sm text-text-secondary">
                    Customize at Age {age} (Year {calculatedYear})
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-board-light rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-chalk-white" />
              </button>
            </div>

            {/* Content based on module type */}
            <div className="space-y-6">
              {/* Housing Customization */}
              {module.type === 'house' && (
                <>
                  {/* Property Price */}
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      Property Price
                    </label>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-chalk-green" />
                      <input
                        type="number"
                        value={loanDetails.loanAmount + loanDetails.downpayment}
                        onChange={(e) => {
                          const total = Number(e.target.value);
                          const down = total * 0.25;
                          setLoanDetails(prev => ({
                            ...prev,
                            downpayment: down,
                            loanAmount: total - down
                          }));
                          setCustomModule(prev => ({
                            ...prev,
                            costs: { ...prev.costs, oneTime: down }
                          }));
                        }}
                        className="flex-1 bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                                 border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Government Grants */}
                  <div className="bg-board-light p-4 rounded-lg border border-chalk-green">
                    <h3 className="font-chalk text-chalk-green mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Government Grants (BTO/Resale)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-casual text-chalk-white">
                          Enhanced Housing Grant (EHG)
                        </label>
                        <input
                          type="number"
                          value={grants.enhanced}
                          onChange={(e) => setGrants(prev => ({ ...prev, enhanced: Number(e.target.value) }))}
                          className="w-32 bg-board text-chalk-green font-casual px-2 py-1 rounded
                                   border border-chalk-green focus:outline-none focus:border-chalk-yellow"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-casual text-chalk-white">
                          Proximity Housing Grant (PHG)
                        </label>
                        <input
                          type="number"
                          value={grants.proximity}
                          onChange={(e) => setGrants(prev => ({ ...prev, proximity: Number(e.target.value) }))}
                          className="w-32 bg-board text-chalk-green font-casual px-2 py-1 rounded
                                   border border-chalk-green focus:outline-none focus:border-chalk-yellow"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-casual text-chalk-white">
                          Singles Grant (if applicable)
                        </label>
                        <input
                          type="number"
                          value={grants.singles}
                          onChange={(e) => setGrants(prev => ({ ...prev, singles: Number(e.target.value) }))}
                          className="w-32 bg-board text-chalk-green font-casual px-2 py-1 rounded
                                   border border-chalk-green focus:outline-none focus:border-chalk-yellow"
                          placeholder="0"
                        />
                      </div>
                      <div className="pt-2 border-t border-chalk-white border-opacity-30">
                        <div className="flex justify-between font-chalk">
                          <span className="text-chalk-yellow">Total Grants:</span>
                          <span className="text-chalk-green">
                            {formatCurrency(Object.values(grants).reduce((a, b) => a + b, 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CPF vs Cash Split */}
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      CPF vs Cash Split for Downpayment
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-casual text-chalk-blue w-20">CPF OA:</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={cpfUsage}
                          onChange={(e) => setCpfUsage(Number(e.target.value))}
                          className="flex-1 accent-chalk-blue"
                        />
                        <span className="w-16 text-right font-casual text-chalk-blue">
                          {cpfUsage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-casual text-chalk-green w-20">Cash:</span>
                        <div className="flex-1 h-2 bg-board-light rounded-full">
                          <div
                            className="h-full bg-chalk-green rounded-full"
                            style={{ width: `${100 - cpfUsage}%` }}
                          />
                        </div>
                        <span className="w-16 text-right font-casual text-chalk-green">
                          {100 - cpfUsage}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-casual text-chalk-white opacity-70">
                      CPF: {formatCurrency(loanDetails.downpayment * cpfUsage / 100)} |
                      Cash: {formatCurrency(loanDetails.downpayment * (100 - cpfUsage) / 100)}
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-chalk text-chalk-white mb-2">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={loanDetails.interestRate}
                        onChange={(e) => setLoanDetails(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                        className="w-full bg-board-light text-chalk-white font-casual px-3 py-2 rounded
                                 border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                      <div className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                        HDB: 2.6% | Bank: 3-4%
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-chalk text-chalk-white mb-2">
                        Loan Tenure (years)
                      </label>
                      <input
                        type="number"
                        value={loanDetails.loanTenure}
                        onChange={(e) => setLoanDetails(prev => ({ ...prev, loanTenure: Number(e.target.value) }))}
                        className="w-full bg-board-light text-chalk-white font-casual px-3 py-2 rounded
                                 border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Car Customization */}
              {module.type === 'car' && (
                <>
                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      Car Price (including COE)
                    </label>
                    <input
                      type="number"
                      value={customModule.costs?.oneTime || 0}
                      onChange={(e) => setCustomModule(prev => ({
                        ...prev,
                        costs: { ...prev.costs, oneTime: Number(e.target.value) }
                      }))}
                      className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                               border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    />
                    <div className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                      Current COE (Cat A): ~$100k | Cat B: ~$110k
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      Monthly Expenses (loan, insurance, petrol, parking)
                    </label>
                    <input
                      type="number"
                      value={customModule.costs?.monthly || 0}
                      onChange={(e) => setCustomModule(prev => ({
                        ...prev,
                        costs: { ...prev.costs, monthly: Number(e.target.value) }
                      }))}
                      className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                               border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Child Customization */}
              {module.type === 'child' && (
                <>
                  <div className="bg-board-light p-4 rounded-lg border border-chalk-pink">
                    <h3 className="font-chalk text-chalk-pink mb-3">Baby Bonus & Subsidies</h3>
                    <div className="space-y-2 text-sm font-casual text-chalk-white">
                      <div className="flex justify-between">
                        <span>Baby Bonus Cash Gift:</span>
                        <span className="text-chalk-green">$10,000 (1st/2nd)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CDA First Step:</span>
                        <span className="text-chalk-green">$6,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Childcare Subsidies:</span>
                        <span className="text-chalk-green">Up to $600/mo</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-chalk text-chalk-white mb-2">
                      Monthly Child Expenses
                    </label>
                    <input
                      type="number"
                      value={customModule.costs?.monthly || 0}
                      onChange={(e) => setCustomModule(prev => ({
                        ...prev,
                        costs: { ...prev.costs, monthly: Number(e.target.value) }
                      }))}
                      className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                               border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                    />
                    <div className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                      Includes: Childcare, food, medical, enrichment classes
                    </div>
                  </div>
                </>
              )}

              {/* Job/Career Customization */}
              {(module.type === 'career' || module.type === 'retirement') && module.salaryChange && (
                <>
                  <div className="bg-board-light p-4 rounded-lg border border-chalk-blue">
                    <h3 className="font-chalk text-chalk-blue mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {module.salaryChange.type === 'replace' && 'Monthly Salary'}
                      {module.salaryChange.type === 'add' && 'Additional Monthly Income'}
                      {module.salaryChange.type === 'multiply' && 'Salary Adjustment'}
                    </h3>

                    {module.salaryChange.type === 'replace' && (
                      <div>
                        <label className="block text-sm font-casual text-chalk-white mb-2">
                          New Monthly Salary (SGD)
                        </label>
                        <input
                          type="number"
                          value={customModule.salaryChange?.amount || 5000}
                          onChange={(e) => setCustomModule(prev => ({
                            ...prev,
                            salaryChange: { ...prev.salaryChange!, amount: Number(e.target.value) }
                          }))}
                          className="w-full bg-board text-chalk-white font-casual text-lg px-3 py-2 rounded
                                   border border-chalk-blue focus:border-chalk-yellow focus:outline-none"
                          placeholder="5000"
                        />
                        <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                          This replaces your current base salary from this age onwards
                        </p>
                      </div>
                    )}

                    {module.salaryChange.type === 'add' && (
                      <div>
                        <label className="block text-sm font-casual text-chalk-white mb-2">
                          Additional Monthly Income (SGD)
                        </label>
                        <input
                          type="number"
                          value={customModule.salaryChange?.amount || 1500}
                          onChange={(e) => setCustomModule(prev => ({
                            ...prev,
                            salaryChange: { ...prev.salaryChange!, amount: Number(e.target.value) }
                          }))}
                          className="w-full bg-board text-chalk-white font-casual text-lg px-3 py-2 rounded
                                   border border-chalk-blue focus:border-chalk-yellow focus:outline-none"
                          placeholder="1500"
                        />
                        <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                          This adds to your existing income (e.g., side hustle, freelance)
                        </p>
                      </div>
                    )}

                    {module.salaryChange.type === 'multiply' && (
                      <div>
                        <label className="block text-sm font-casual text-chalk-white mb-2">
                          Salary Multiplier
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            step="0.01"
                            value={customModule.salaryChange?.amount || 1.20}
                            onChange={(e) => setCustomModule(prev => ({
                              ...prev,
                              salaryChange: { ...prev.salaryChange!, amount: Number(e.target.value) }
                            }))}
                            className="flex-1 bg-board text-chalk-white font-casual text-lg px-3 py-2 rounded
                                     border border-chalk-blue focus:border-chalk-yellow focus:outline-none"
                            placeholder="1.20"
                          />
                          <span className="font-chalk text-chalk-green text-xl">
                            {((customModule.salaryChange?.amount || 1.20) - 1) * 100 > 0 ? '+' : ''}
                            {(((customModule.salaryChange?.amount || 1.20) - 1) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                          {customModule.salaryChange?.amount === 0
                            ? 'Sets income to $0 (career break/retirement)'
                            : 'Multiplies your current salary (e.g., 1.20 = 20% raise)'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Setup costs for side hustles */}
                  {module.id === 'side-hustle' && (
                    <div>
                      <label className="block text-sm font-chalk text-chalk-white mb-2">
                        Initial Setup Cost
                      </label>
                      <input
                        type="number"
                        value={customModule.costs?.oneTime || 5000}
                        onChange={(e) => setCustomModule(prev => ({
                          ...prev,
                          costs: { ...prev.costs, oneTime: Number(e.target.value) }
                        }))}
                        className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                                 border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                        placeholder="5000"
                      />
                      <p className="text-xs font-casual text-chalk-white opacity-70 mt-1">
                        Equipment, licensing, initial inventory, etc.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Generic Cost Customization for other types */}
              {!['house', 'car', 'child', 'career', 'retirement'].includes(module.type) && (
                <>
                  {customModule.costs?.oneTime !== undefined && (
                    <div>
                      <label className="block text-sm font-chalk text-chalk-white mb-2">
                        One-time Cost
                      </label>
                      <input
                        type="number"
                        value={customModule.costs.oneTime}
                        onChange={(e) => setCustomModule(prev => ({
                          ...prev,
                          costs: { ...prev.costs, oneTime: Number(e.target.value) }
                        }))}
                        className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                                 border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                    </div>
                  )}

                  {customModule.costs?.monthly !== undefined && (
                    <div>
                      <label className="block text-sm font-chalk text-chalk-white mb-2">
                        Monthly Cost/Income
                      </label>
                      <input
                        type="number"
                        value={customModule.costs.monthly}
                        onChange={(e) => setCustomModule(prev => ({
                          ...prev,
                          costs: { ...prev.costs, monthly: Number(e.target.value) }
                        }))}
                        className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                                 border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Duration (if applicable) */}
              {customModule.costs?.duration && (
                <div>
                  <label className="block text-sm font-chalk text-chalk-white mb-2">
                    Duration (years)
                  </label>
                  <input
                    type="number"
                    value={Math.round(customModule.costs.duration / 12)}
                    onChange={(e) => setCustomModule(prev => ({
                      ...prev,
                      costs: { ...prev.costs, duration: Number(e.target.value) * 12 }
                    }))}
                    className="w-full bg-board-light text-chalk-white font-casual text-lg px-3 py-2 rounded
                             border border-chalk-white border-opacity-30 focus:border-chalk-yellow focus:outline-none"
                  />
                </div>
              )}

              {/* Summary */}
              <div className="bg-board-light p-4 rounded-lg border border-chalk-yellow">
                <h3 className="font-chalk text-chalk-yellow mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Financial Impact Summary
                </h3>
                <div className="space-y-2 text-sm font-casual">
                  {module.type === 'house' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-chalk-white">Property Price:</span>
                        <span className="text-chalk-white">
                          {formatCurrency(loanDetails.loanAmount + loanDetails.downpayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-chalk-white">Less Grants:</span>
                        <span className="text-chalk-green">
                          -{formatCurrency(Object.values(grants).reduce((a, b) => a + b, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-chalk-white border-opacity-30 pt-2">
                        <span className="text-chalk-white">Net Downpayment:</span>
                        <span className="text-chalk-yellow">
                          {formatCurrency(Math.max(0, loanDetails.downpayment - Object.values(grants).reduce((a, b) => a + b, 0)))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-chalk-white">Monthly Payment:</span>
                        <span className="text-chalk-red">
                          {formatCurrency(calculateMonthlyPayment())}
                        </span>
                      </div>
                    </>
                  )}

                  {module.type !== 'house' && (
                    <>
                      {customModule.costs?.oneTime && (
                        <div className="flex justify-between">
                          <span className="text-chalk-white">Initial Cost:</span>
                          <span className="text-chalk-red">
                            {formatCurrency(customModule.costs.oneTime)}
                          </span>
                        </div>
                      )}
                      {customModule.costs?.monthly && (
                        <div className="flex justify-between">
                          <span className="text-chalk-white">
                            {customModule.costs.monthly > 0 ? 'Monthly Cost:' : 'Monthly Income:'}
                          </span>
                          <span className={customModule.costs.monthly > 0 ? 'text-chalk-red' : 'text-chalk-green'}>
                            {formatCurrency(Math.abs(customModule.costs.monthly))}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border-2 border-chalk-white border-opacity-30
                         text-chalk-white font-chalk rounded-lg hover:bg-board-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 px-4 bg-chalk-yellow text-board font-chalk
                         rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Add to Timeline
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}