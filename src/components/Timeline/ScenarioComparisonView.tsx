import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';
import { Scenario } from '@/stores/timelineStore';

interface ScenarioComparisonViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScenarioComparisonView({ isOpen, onClose }: ScenarioComparisonViewProps) {
  const { scenarios, financial } = useTimelineStore();

  // Calculate projections for each scenario
  const scenarioProjections = useMemo(() => {
    return scenarios.map(scenario => {
      // Here we would recalculate projections for each scenario
      // For now, we'll use a simplified version
      return {
        scenario,
        // You'd call calculateProjections with scenario.modules and scenario.financial
        // For demonstration, using placeholder data
        keyMetrics: {
          totalNetWorth: Math.floor(Math.random() * 2000000) + 500000,
          retirementAge65NetWorth: Math.floor(Math.random() * 1500000) + 300000,
          peakCashFlow: Math.floor(Math.random() * 10000) + 2000,
          totalModules: scenario.modules.length,
        }
      };
    });
  }, [scenarios]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBestScenario = (metric: 'netWorth' | 'cashFlow') => {
    if (metric === 'netWorth') {
      return scenarioProjections.reduce((best, curr) =>
        curr.keyMetrics.totalNetWorth > best.keyMetrics.totalNetWorth ? curr : best
      );
    } else {
      return scenarioProjections.reduce((best, curr) =>
        curr.keyMetrics.peakCashFlow > best.keyMetrics.peakCashFlow ? curr : best
      );
    }
  };

  if (!isOpen || scenarios.length === 0) return null;

  const bestNetWorthScenario = getBestScenario('netWorth');
  const bestCashFlowScenario = getBestScenario('cashFlow');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 pointer-events-none"
          />

          {/* Full Screen Comparison View */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full bg-board rounded-lg shadow-2xl border-2 border-chalk-yellow flex flex-col pointer-events-auto"
            >
            {/* Header */}
            <div className="bg-board-dark p-6 border-b-2 border-chalk-yellow flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-3xl font-chalk text-chalk-yellow">Scenario Comparison</h2>
                <p className="text-sm font-casual text-chalk-white mt-1">
                  Compare {scenarios.length} life paths side by side
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-board-light rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-chalk-white" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Best Net Worth */}
                <div className="bg-board-dark p-4 rounded-lg border-2 border-chalk-green">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-chalk-green" />
                    <span className="font-chalk text-chalk-green">Best Net Worth</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: bestNetWorthScenario.scenario.color.color }}
                    />
                    <span className="font-chalk text-xl text-chalk-white">
                      {bestNetWorthScenario.scenario.name}
                    </span>
                  </div>
                  <div className="text-chalk-green font-casual text-2xl mt-1">
                    {formatCurrency(bestNetWorthScenario.keyMetrics.totalNetWorth)}
                  </div>
                </div>

                {/* Best Cash Flow */}
                <div className="bg-board-dark p-4 rounded-lg border-2 border-chalk-blue">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-chalk-blue" />
                    <span className="font-chalk text-chalk-blue">Best Cash Flow</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: bestCashFlowScenario.scenario.color.color }}
                    />
                    <span className="font-chalk text-xl text-chalk-white">
                      {bestCashFlowScenario.scenario.name}
                    </span>
                  </div>
                  <div className="text-chalk-blue font-casual text-2xl mt-1">
                    {formatCurrency(bestCashFlowScenario.keyMetrics.peakCashFlow)}/mo
                  </div>
                </div>
              </div>

              {/* Horizontal Comparison Grid */}
              <div className="bg-board-dark rounded-lg border-2 border-chalk-white overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-chalk-white">
                      <th className="p-4 text-left font-chalk text-chalk-yellow sticky left-0 bg-board-dark z-10">
                        Metric
                      </th>
                      {scenarioProjections.map(({ scenario }) => (
                        <th
                          key={scenario.id}
                          className="p-4 text-center font-chalk min-w-[200px]"
                          style={{ color: scenario.color.color }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg"
                              style={{ backgroundColor: scenario.color.color }}
                            />
                            <div>{scenario.name}</div>
                            {scenario.description && (
                              <div className="text-xs font-casual text-chalk-white opacity-70 max-w-[180px] line-clamp-2">
                                {scenario.description}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Total Modules */}
                    <tr className="border-b border-chalk-white border-opacity-30 hover:bg-board-light">
                      <td className="p-4 font-casual text-chalk-white sticky left-0 bg-board-dark">
                        Life Events
                      </td>
                      {scenarioProjections.map(({ scenario, keyMetrics }) => (
                        <td key={scenario.id} className="p-4 text-center font-casual text-chalk-white">
                          {keyMetrics.totalModules}
                        </td>
                      ))}
                    </tr>

                    {/* Total Net Worth */}
                    <tr className="border-b border-chalk-white border-opacity-30 hover:bg-board-light">
                      <td className="p-4 font-casual text-chalk-white sticky left-0 bg-board-dark">
                        <div className="flex items-center gap-2">
                          <PiggyBank className="w-4 h-4 text-chalk-green" />
                          Total Net Worth (Age 90)
                        </div>
                      </td>
                      {scenarioProjections.map(({ scenario, keyMetrics }) => {
                        const isBest = keyMetrics.totalNetWorth === bestNetWorthScenario.keyMetrics.totalNetWorth;
                        return (
                          <td
                            key={scenario.id}
                            className={`p-4 text-center font-casual ${
                              isBest ? 'text-chalk-green font-bold' : 'text-chalk-white'
                            }`}
                          >
                            {formatCurrency(keyMetrics.totalNetWorth)}
                            {isBest && <span className="ml-2">🏆</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Net Worth at 65 */}
                    <tr className="border-b border-chalk-white border-opacity-30 hover:bg-board-light">
                      <td className="p-4 font-casual text-chalk-white sticky left-0 bg-board-dark">
                        Net Worth at Retirement (65)
                      </td>
                      {scenarioProjections.map(({ scenario, keyMetrics }) => (
                        <td key={scenario.id} className="p-4 text-center font-casual text-chalk-white">
                          {formatCurrency(keyMetrics.retirementAge65NetWorth)}
                        </td>
                      ))}
                    </tr>

                    {/* Peak Cash Flow */}
                    <tr className="border-b border-chalk-white border-opacity-30 hover:bg-board-light">
                      <td className="p-4 font-casual text-chalk-white sticky left-0 bg-board-dark">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-chalk-blue" />
                          Peak Monthly Cash Flow
                        </div>
                      </td>
                      {scenarioProjections.map(({ scenario, keyMetrics }) => {
                        const isBest = keyMetrics.peakCashFlow === bestCashFlowScenario.keyMetrics.peakCashFlow;
                        return (
                          <td
                            key={scenario.id}
                            className={`p-4 text-center font-casual ${
                              isBest ? 'text-chalk-blue font-bold' : 'text-chalk-white'
                            }`}
                          >
                            {formatCurrency(keyMetrics.peakCashFlow)}/mo
                            {isBest && <span className="ml-2">🏆</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Branched From */}
                    <tr className="hover:bg-board-light">
                      <td className="p-4 font-casual text-chalk-white sticky left-0 bg-board-dark">
                        Branched From
                      </td>
                      {scenarioProjections.map(({ scenario }) => (
                        <td key={scenario.id} className="p-4 text-center font-casual text-chalk-white opacity-70 text-sm">
                          {scenario.branchedFrom
                            ? `Age ${scenario.branchAge}`
                            : 'Base scenario'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Module Comparison */}
              <div className="mt-6">
                <h3 className="font-chalk text-xl text-chalk-yellow mb-4">Life Events Breakdown</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${scenarios.length}, 1fr)` }}>
                  {scenarioProjections.map(({ scenario }) => (
                    <div
                      key={scenario.id}
                      className="bg-board-dark p-4 rounded-lg border-2"
                      style={{ borderColor: scenario.color.color }}
                    >
                      <h4 className="font-chalk mb-3" style={{ color: scenario.color.color }}>
                        {scenario.name}
                      </h4>
                      <div className="space-y-2">
                        {scenario.modules.length === 0 ? (
                          <p className="text-xs font-casual text-chalk-white opacity-50">
                            No life events
                          </p>
                        ) : (
                          scenario.modules
                            .sort((a, b) => a.age - b.age)
                            .slice(0, 10)
                            .map((module) => (
                              <div
                                key={module.id}
                                className="text-sm font-casual text-chalk-white flex items-center gap-2"
                              >
                                <span>{module.icon}</span>
                                <span className="flex-1 truncate">{module.name}</span>
                                <span className="text-xs opacity-70">Age {module.age}</span>
                              </div>
                            ))
                        )}
                        {scenario.modules.length > 10 && (
                          <p className="text-xs font-casual text-chalk-white opacity-50">
                            +{scenario.modules.length - 10} more...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-board-dark p-4 border-t-2 border-chalk-yellow flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-chalk-yellow text-board font-chalk py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Close Comparison
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
