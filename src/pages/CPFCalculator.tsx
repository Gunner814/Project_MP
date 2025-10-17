import { useState, useEffect } from 'react';
import { Info, TrendingUp, PiggyBank } from 'lucide-react';
import { calculateCPFContribution } from '@constants/singapore';

export default function CPFCalculator() {
  const [age, setAge] = useState(30);
  const [salary, setSalary] = useState(5000);
  const [currentOA, setCurrentOA] = useState(50000);
  const [currentSA, setCurrentSA] = useState(30000);
  const [currentMA, setCurrentMA] = useState(20000);
  const [yearsToProject, setYearsToProject] = useState(35);

  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateProjection();
  }, [age, salary, currentOA, currentSA, currentMA, yearsToProject]);

  const calculateProjection = () => {
    let projectedOA = currentOA;
    let projectedSA = currentSA;
    let projectedMA = currentMA;
    let totalContributions = 0;

    for (let year = 0; year < yearsToProject; year++) {
      const currentAge = age + year;
      const contribution = calculateCPFContribution(currentAge, salary);

      // Add contributions
      projectedOA += contribution.allocation.OA * 12;
      projectedSA += contribution.allocation.SA * 12;
      projectedMA += contribution.allocation.MA * 12;
      totalContributions += contribution.total * 12;

      // Add interest (simplified - actual calculation is more complex)
      projectedOA *= 1.025; // 2.5% for OA
      projectedSA *= 1.04;  // 4% for SA
      projectedMA *= 1.04;  // 4% for MA

      // Extra interest on first $60k (simplified)
      const total = projectedOA + projectedSA + projectedMA;
      if (total <= 60000) {
        const extraInterest = total * 0.01;
        projectedSA += extraInterest;
      }
    }

    setResults({
      projectedOA: Math.round(projectedOA),
      projectedSA: Math.round(projectedSA),
      projectedMA: Math.round(projectedMA),
      total: Math.round(projectedOA + projectedSA + projectedMA),
      totalContributions: Math.round(totalContributions),
      retirementSum: Math.round(projectedOA + projectedSA), // Simplified
      monthlyContribution: calculateCPFContribution(age, salary)
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-chalk text-chalk-yellow mb-2">
            CPF Calculator
          </h1>
          <p className="text-xl font-casual text-chalk-white">
            Project your CPF savings and optimize for retirement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="chalk-card">
            <h2 className="text-2xl font-chalk text-chalk-green mb-6">
              Your Details
            </h2>

            <div className="space-y-6">
              {/* Age */}
              <div>
                <label className="block text-chalk-yellow font-chalk mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={17}
                  max={70}
                  className="chalk-input w-full"
                />
                <p className="text-sm text-chalk-blue font-casual mt-1">
                  CPF contributions start at age 17
                </p>
              </div>

              {/* Monthly Salary */}
              <div>
                <label className="block text-chalk-yellow font-chalk mb-2">
                  Monthly Salary (SGD)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  min={0}
                  max={20000}
                  step={100}
                  className="chalk-input w-full"
                />
                <p className="text-sm text-chalk-blue font-casual mt-1">
                  Capped at $6,000 for CPF contributions
                </p>
              </div>

              {/* Current CPF Balances */}
              <div className="space-y-4">
                <h3 className="text-lg font-chalk text-chalk-pink">
                  Current CPF Balances
                </h3>

                <div>
                  <label className="block text-chalk-white font-casual mb-1">
                    Ordinary Account (OA)
                  </label>
                  <input
                    type="number"
                    value={currentOA}
                    onChange={(e) => setCurrentOA(Number(e.target.value))}
                    min={0}
                    step={1000}
                    className="chalk-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-chalk-white font-casual mb-1">
                    Special Account (SA)
                  </label>
                  <input
                    type="number"
                    value={currentSA}
                    onChange={(e) => setCurrentSA(Number(e.target.value))}
                    min={0}
                    step={1000}
                    className="chalk-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-chalk-white font-casual mb-1">
                    MediSave Account (MA)
                  </label>
                  <input
                    type="number"
                    value={currentMA}
                    onChange={(e) => setCurrentMA(Number(e.target.value))}
                    min={0}
                    step={1000}
                    className="chalk-input w-full"
                  />
                </div>
              </div>

              {/* Years to Project */}
              <div>
                <label className="block text-chalk-yellow font-chalk mb-2">
                  Years to Project
                </label>
                <input
                  type="number"
                  value={yearsToProject}
                  onChange={(e) => setYearsToProject(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="chalk-input w-full"
                />
                <p className="text-sm text-chalk-blue font-casual mt-1">
                  Project until age {age + yearsToProject}
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly Contribution */}
            {results && (
              <>
                <div className="chalk-card bg-board-light">
                  <h3 className="text-xl font-chalk text-chalk-green mb-4">
                    Monthly CPF Contribution
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-casual text-chalk-white">Employee</p>
                      <p className="text-2xl font-chalk text-chalk-yellow">
                        ${results.monthlyContribution.employee.toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-casual text-chalk-white">Employer</p>
                      <p className="text-2xl font-chalk text-chalk-yellow">
                        ${results.monthlyContribution.employer.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-chalk-white">
                    <p className="text-sm font-casual text-chalk-white">Total Monthly</p>
                    <p className="text-3xl font-chalk text-chalk-green">
                      ${results.monthlyContribution.total.toFixed(0)}
                    </p>
                  </div>
                </div>

                {/* Projected Balances */}
                <div className="chalk-card">
                  <h3 className="text-xl font-chalk text-chalk-pink mb-4">
                    Projected at Age {age + yearsToProject}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-casual text-chalk-white">Ordinary Account</span>
                      <span className="text-xl font-chalk text-chalk-yellow">
                        ${results.projectedOA.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-casual text-chalk-white">Special Account</span>
                      <span className="text-xl font-chalk text-chalk-yellow">
                        ${results.projectedSA.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-casual text-chalk-white">MediSave Account</span>
                      <span className="text-xl font-chalk text-chalk-yellow">
                        ${results.projectedMA.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-chalk-white">
                      <div className="flex justify-between items-center">
                        <span className="font-chalk text-chalk-green text-lg">Total CPF</span>
                        <span className="text-2xl font-chalk text-chalk-green">
                          ${results.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CPF LIFE Estimate */}
                <div className="chalk-card bg-board-light">
                  <h3 className="text-xl font-chalk text-chalk-blue mb-4">
                    Retirement Estimates
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-casual text-chalk-white mb-1">
                        Estimated Retirement Sum (OA + SA)
                      </p>
                      <p className="text-2xl font-chalk text-chalk-yellow">
                        ${results.retirementSum.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-casual text-chalk-white mb-1">
                        Estimated CPF LIFE Payout (monthly)
                      </p>
                      <p className="text-2xl font-chalk text-chalk-green">
                        ${Math.round(results.retirementSum * 0.005).toLocaleString()}
                      </p>
                      <p className="text-xs font-casual text-chalk-blue mt-1">
                        *Rough estimate at 6% annual payout
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tips */}
            <div className="p-4 border-2 border-chalk-yellow border-dashed rounded-lg">
              <h3 className="text-lg font-chalk text-chalk-yellow mb-3">
                CPF Optimization Tips
              </h3>
              <ul className="space-y-2 text-chalk-white font-casual text-sm">
                <li className="flex items-start">
                  <span className="text-chalk-green mr-2">•</span>
                  Top up SA to FRS for guaranteed 4% returns
                </li>
                <li className="flex items-start">
                  <span className="text-chalk-green mr-2">•</span>
                  Cash top-ups get up to $8,000 tax relief
                </li>
                <li className="flex items-start">
                  <span className="text-chalk-green mr-2">•</span>
                  Extra 1% interest on first $60,000
                </li>
                <li className="flex items-start">
                  <span className="text-chalk-green mr-2">•</span>
                  Consider voluntary housing refund for higher returns
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="chalk-card">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-chalk-blue mr-2" />
              <h4 className="font-chalk text-chalk-blue">CPF Interest Rates</h4>
            </div>
            <ul className="text-sm font-casual text-chalk-white space-y-1">
              <li>OA: 2.5% p.a.</li>
              <li>SA: 4.0% p.a.</li>
              <li>MA: 4.0% p.a.</li>
              <li>RA: 4.0% p.a.</li>
            </ul>
          </div>

          <div className="chalk-card">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-chalk-green mr-2" />
              <h4 className="font-chalk text-chalk-green">Contribution Rates</h4>
            </div>
            <ul className="text-sm font-casual text-chalk-white space-y-1">
              <li>≤35 years: 37% total</li>
              <li>36-45: 37% total</li>
              <li>46-50: 37% total</li>
              <li>51-55: 35% total</li>
            </ul>
          </div>

          <div className="chalk-card">
            <div className="flex items-center mb-2">
              <PiggyBank className="w-5 h-5 text-chalk-pink mr-2" />
              <h4 className="font-chalk text-chalk-pink">Retirement Sums 2024</h4>
            </div>
            <ul className="text-sm font-casual text-chalk-white space-y-1">
              <li>BRS: $102,900</li>
              <li>FRS: $205,800</li>
              <li>ERS: $308,700</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}