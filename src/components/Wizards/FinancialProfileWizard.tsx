import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Save, Calculator, Home, Car, Briefcase, Heart, DollarSign } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const steps: WizardStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: <Heart className="w-6 h-6" />,
    description: 'Basic details about you'
  },
  {
    id: 'income',
    title: 'Income & Employment',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Your monthly income sources'
  },
  {
    id: 'cpf',
    title: 'CPF Balances',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Current CPF account balances'
  },
  {
    id: 'assets',
    title: 'Assets & Investments',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Cash, investments, and other assets'
  },
  {
    id: 'property',
    title: 'Properties',
    icon: <Home className="w-6 h-6" />,
    description: 'Property ownership details'
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    icon: <Car className="w-6 h-6" />,
    description: 'Cars and motorcycles'
  },
  {
    id: 'liabilities',
    title: 'Loans & Debts',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Current loans and liabilities'
  },
  {
    id: 'expenses',
    title: 'Monthly Expenses',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Regular monthly spending'
  }
];

export default function FinancialProfileWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = (data: any) => {
    // Calculate additional fields
    const profile = {
      ...data,
      age: data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : 30,
      cpfTotal: (data.cpfBalances?.ordinary || 0) +
                (data.cpfBalances?.special || 0) +
                (data.cpfBalances?.medisave || 0) +
                (data.cpfBalances?.retirement || 0),
      netWorth: calculateNetWorth(data),
      savingsRate: calculateSavingsRate(data),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));

    // Show success message
    alert('Profile saved successfully!');

    // Redirect to dashboard
    window.location.href = '/';
  };

  const calculateNetWorth = (data: any) => {
    const assets = (data.cpfBalances?.ordinary || 0) +
                   (data.cpfBalances?.special || 0) +
                   (data.cpfBalances?.medisave || 0) +
                   (data.cpfBalances?.retirement || 0) +
                   (data.cashAndInvestments?.savingsAccount || 0) +
                   (data.cashAndInvestments?.fixedDeposits || 0) +
                   (data.property?.currentValue || 0) +
                   (data.vehicle?.currentValue || 0);

    const liabilities = (data.property?.loanBalance || 0) +
                        (data.vehicle?.loanBalance || 0) +
                        (data.liabilities?.personalLoans || 0) +
                        (data.liabilities?.creditCards || 0) +
                        (data.liabilities?.educationLoans || 0) +
                        (data.liabilities?.others || 0);

    return assets - liabilities;
  };

  const calculateSavingsRate = (data: any) => {
    const monthlyIncome = (data.monthlyIncome?.basic || 0) +
                          (data.monthlyIncome?.allowances || 0) +
                          (data.monthlyIncome?.bonus || 0) +
                          (data.monthlyIncome?.commission || 0) +
                          (data.monthlyIncome?.rental || 0) +
                          (data.monthlyIncome?.dividends || 0);

    const monthlyExpenses = (data.expenses?.food || 0) +
                            (data.expenses?.transport || 0) +
                            (data.expenses?.utilities || 0) +
                            (data.expenses?.insurance || 0) +
                            (data.expenses?.entertainment || 0) +
                            (data.expenses?.shopping || 0) +
                            (data.expenses?.parentSupport || 0) +
                            (data.expenses?.childrenEducation || 0) +
                            (data.property?.monthlyPayment || 0) +
                            (data.vehicle?.monthlyPayment || 0);

    if (monthlyIncome === 0) return 0;
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    return Math.max(0, Math.round(savingsRate));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return <PersonalInfoStep register={register} errors={errors} watch={watch} />;
      case 'income':
        return <IncomeStep register={register} errors={errors} watch={watch} />;
      case 'cpf':
        return <CPFStep register={register} errors={errors} />;
      case 'assets':
        return <AssetsStep register={register} errors={errors} />;
      case 'property':
        return <PropertyStep register={register} errors={errors} />;
      case 'vehicles':
        return <VehiclesStep register={register} errors={errors} />;
      case 'liabilities':
        return <LiabilitiesStep register={register} errors={errors} />;
      case 'expenses':
        return <ExpensesStep register={register} errors={errors} watch={watch} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-board p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index <= currentStep ? 'text-chalk-yellow' : 'text-chalk-white opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    index <= currentStep ? 'border-chalk-yellow' : 'border-chalk-white'
                  }`}
                >
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      index < currentStep ? 'bg-chalk-yellow' : 'bg-chalk-white opacity-30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-chalk text-chalk-yellow mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-chalk-white font-casual">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="chalk-card mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`chalk-button flex items-center gap-2 ${
                currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                className="chalk-button bg-chalk-green text-board flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="chalk-button flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Step Components

function PersonalInfoStep({ register, errors, watch }: any) {
  const gender = watch('gender');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Full Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="chalk-input w-full"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-chalk-red text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
            className="chalk-input w-full"
          />
          {errors.dateOfBirth && (
            <p className="text-chalk-red text-sm mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Gender
          </label>
          <select
            {...register('gender', { required: 'Gender is required' })}
            className="chalk-input w-full"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-chalk-red text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Nationality
          </label>
          <select
            {...register('nationality', { required: 'Nationality is required' })}
            className="chalk-input w-full"
          >
            <option value="">Select nationality</option>
            <option value="singaporean">Singaporean</option>
            <option value="pr">Permanent Resident</option>
            <option value="foreigner">Foreigner</option>
          </select>
          {errors.nationality && (
            <p className="text-chalk-red text-sm mt-1">{errors.nationality.message}</p>
          )}
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Marital Status
          </label>
          <select
            {...register('maritalStatus', { required: 'Marital status is required' })}
            className="chalk-input w-full"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Number of Children
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              defaultValue="0"
              {...register('numberOfChildren')}
              className="flex-1 h-3 bg-board-light rounded-lg appearance-none cursor-pointer accent-chalk-blue"
            />
            <div className="w-16 text-right">
              <span className="text-2xl font-chalk text-chalk-yellow">
                {watch('numberOfChildren') || 0}
              </span>
            </div>
          </div>
        </div>

        {gender === 'male' && (
          <div>
            <label className="block text-chalk-yellow font-chalk mb-2">
              NS Status
            </label>
            <select
              {...register('nsStatus')}
              className="chalk-input w-full"
            >
              <option value="">Select NS status</option>
              <option value="pre-enlistment">Pre-enlistment</option>
              <option value="serving">Currently Serving</option>
              <option value="reservist">Reservist</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function IncomeStep({ register, watch }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Monthly Income (SGD)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Basic Salary
          </label>
          <input
            type="number"
            {...register('monthlyIncome.basic', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Allowances
          </label>
          <input
            type="number"
            {...register('monthlyIncome.allowances', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Annual Bonus (÷12)
          </label>
          <input
            type="number"
            {...register('monthlyIncome.bonus', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Commission
          </label>
          <input
            type="number"
            {...register('monthlyIncome.commission', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Rental Income
          </label>
          <input
            type="number"
            {...register('monthlyIncome.rental', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Dividends/Interest
          </label>
          <input
            type="number"
            {...register('monthlyIncome.dividends', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>
      </div>

      {/* Savings Section */}
      <div className="mt-8 p-4 border-2 border-chalk-green border-dashed rounded-lg">
        <h3 className="text-2xl font-chalk text-chalk-green mb-4">
          Monthly Savings
        </h3>
        <p className="text-chalk-white font-casual mb-4 text-sm">
          How much do you typically save each month? This helps us calculate your savings rate and project your financial future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-chalk-yellow font-chalk mb-2">
              Monthly Savings Amount (SGD)
            </label>
            <input
              type="number"
              {...register('monthlySavings', { min: 0 })}
              className="chalk-input w-full"
              placeholder="1000"
              step="100"
            />
            <p className="text-chalk-blue text-sm mt-1 font-casual">
              Amount you save/invest each month
            </p>
          </div>

          <div>
            <label className="block text-chalk-yellow font-chalk mb-2">
              Or Savings Rate (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                defaultValue="20"
                {...register('savingsRate')}
                className="flex-1 h-3 bg-board-light rounded-lg appearance-none cursor-pointer accent-chalk-green"
              />
              <div className="w-20 text-right">
                <span className="text-2xl font-chalk text-chalk-yellow">
                  {watch('savingsRate') || 20}%
                </span>
              </div>
            </div>
            <p className="text-chalk-blue text-sm mt-1 font-casual">
              Recommended: 20-30% of income
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-board-light rounded-lg">
          <p className="text-chalk-white font-casual text-xs">
            💡 <strong>Tip:</strong> Singapore average savings rate is 28%. Financial experts recommend at least 20% for a comfortable retirement.
          </p>
        </div>
      </div>
    </div>
  );
}

function CPFStep({ register, errors }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Current CPF Balances (SGD)
      </h3>

      <div className="bg-board-light p-4 rounded-lg mb-6">
        <p className="text-chalk-white font-casual">
          💡 Tip: You can check your CPF balances via the CPF app or website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Ordinary Account (OA)
          </label>
          <input
            type="number"
            {...register('cpfBalances.ordinary', { min: 0, required: 'OA balance is required' })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
          <p className="text-chalk-blue text-sm mt-1 font-casual">
            For housing, investments, education
          </p>
          {errors['cpfBalances.ordinary'] && (
            <p className="text-chalk-red text-sm mt-1">{errors['cpfBalances.ordinary'].message}</p>
          )}
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Special Account (SA)
          </label>
          <input
            type="number"
            {...register('cpfBalances.special', { min: 0, required: 'SA balance is required' })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
          <p className="text-chalk-blue text-sm mt-1 font-casual">
            For retirement (4% interest)
          </p>
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            MediSave Account (MA)
          </label>
          <input
            type="number"
            {...register('cpfBalances.medisave', { min: 0, required: 'MA balance is required' })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
          <p className="text-chalk-blue text-sm mt-1 font-casual">
            For healthcare expenses
          </p>
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Retirement Account (RA)
          </label>
          <input
            type="number"
            {...register('cpfBalances.retirement', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
          <p className="text-chalk-blue text-sm mt-1 font-casual">
            Only if you're 55+
          </p>
        </div>
      </div>

      {/* CPF Summary */}
      <div className="mt-8 p-4 border-2 border-chalk-yellow border-dashed rounded-lg">
        <h4 className="text-chalk-yellow font-chalk text-xl mb-2">
          Quick CPF Info
        </h4>
        <ul className="space-y-1 text-chalk-white font-casual">
          <li>• OA earns 2.5% interest per annum</li>
          <li>• SA & MA earn 4% interest per annum</li>
          <li>• Extra 1% on first $60,000 combined</li>
          <li>• Extra 2% for members aged 55+</li>
        </ul>
      </div>
    </div>
  );
}

function AssetsStep({ register }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Cash & Investments (SGD)
      </h3>

      <div className="space-y-8">
        {/* Cash Holdings */}
        <div>
          <h4 className="text-xl font-chalk text-chalk-yellow mb-4">Cash Holdings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Savings Account
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.savingsAccount', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Fixed Deposits
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.fixedDeposits', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>
          </div>
        </div>

        {/* Investments */}
        <div>
          <h4 className="text-xl font-chalk text-chalk-yellow mb-4">Investments</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Singapore Stocks
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.stocks.singapore', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                International Stocks
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.stocks.international', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Singapore Savings Bonds
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.bonds.singaporeSavingsBonds', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                ETFs
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.etfs', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Unit Trusts
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.unitTrusts', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                SRS Account
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.srs', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Cryptocurrency
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.cryptocurrency', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Robo-Advisors
              </label>
              <input
                type="number"
                {...register('cashAndInvestments.roboAdvisors', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyStep({ register }: any) {
  const [hasProperty, setHasProperty] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Property Ownership
      </h3>

      <div>
        <label className="flex items-center space-x-3 text-chalk-white font-casual">
          <input
            type="checkbox"
            checked={hasProperty}
            onChange={(e) => setHasProperty(e.target.checked)}
            className="w-5 h-5"
          />
          <span>I own property</span>
        </label>
      </div>

      {hasProperty && (
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Property Type
              </label>
              <select
                {...register('property.type')}
                className="chalk-input w-full"
              >
                <option value="">Select type</option>
                <option value="hdb">HDB Flat</option>
                <option value="condo">Condominium</option>
                <option value="landed">Landed Property</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Purchase Price
              </label>
              <input
                type="number"
                {...register('property.purchasePrice', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="10000"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Current Value
              </label>
              <input
                type="number"
                {...register('property.currentValue', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="10000"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Outstanding Loan
              </label>
              <input
                type="number"
                {...register('property.loanBalance', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Monthly Mortgage
              </label>
              <input
                type="number"
                {...register('property.monthlyPayment', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Rental Income (if any)
              </label>
              <input
                type="number"
                {...register('property.rentalIncome', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VehiclesStep({ register }: any) {
  const [hasVehicle, setHasVehicle] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Vehicle Ownership
      </h3>

      <div>
        <label className="flex items-center space-x-3 text-chalk-white font-casual">
          <input
            type="checkbox"
            checked={hasVehicle}
            onChange={(e) => setHasVehicle(e.target.checked)}
            className="w-5 h-5"
          />
          <span>I own a vehicle</span>
        </label>
      </div>

      {hasVehicle && (
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Vehicle Type
              </label>
              <select
                {...register('vehicle.type')}
                className="chalk-input w-full"
              >
                <option value="">Select type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                COE Expiry Date
              </label>
              <input
                type="date"
                {...register('vehicle.coeExpiry')}
                className="chalk-input w-full"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Purchase Price (incl. COE)
              </label>
              <input
                type="number"
                {...register('vehicle.purchasePrice', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Outstanding Loan
              </label>
              <input
                type="number"
                {...register('vehicle.loanBalance', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Monthly Loan Payment
              </label>
              <input
                type="number"
                {...register('vehicle.monthlyPayment', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-yellow font-chalk mb-2">
                Monthly Running Cost
              </label>
              <input
                type="number"
                {...register('vehicle.runningCost', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
              <p className="text-chalk-blue text-sm mt-1 font-casual">
                Petrol, parking, ERP, maintenance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LiabilitiesStep({ register }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Loans & Debts (SGD)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Personal Loans
          </label>
          <input
            type="number"
            {...register('liabilities.personalLoans', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Credit Card Debt
          </label>
          <input
            type="number"
            {...register('liabilities.creditCards', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Education Loans
          </label>
          <input
            type="number"
            {...register('liabilities.educationLoans', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-chalk-yellow font-chalk mb-2">
            Other Debts
          </label>
          <input
            type="number"
            {...register('liabilities.others', { min: 0 })}
            className="chalk-input w-full"
            placeholder="0"
            step="100"
          />
        </div>
      </div>

      {/* Debt Summary Warning */}
      <div className="mt-8 p-4 border-2 border-chalk-pink border-dashed rounded-lg">
        <h4 className="text-chalk-pink font-chalk text-xl mb-2">
          ⚠️ Debt Management Tips
        </h4>
        <ul className="space-y-1 text-chalk-white font-casual">
          <li>• TDSR should not exceed 55% of income</li>
          <li>• Pay off high-interest debt first</li>
          <li>• Avoid credit card debt (25% annual interest)</li>
          <li>• Consider debt consolidation if needed</li>
        </ul>
      </div>
    </div>
  );
}

function ExpensesStep({ register, watch }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-chalk text-chalk-green mb-4">
        Monthly Expenses (SGD)
      </h3>

      <div className="space-y-8">
        {/* Essential Expenses */}
        <div>
          <h4 className="text-xl font-chalk text-chalk-yellow mb-4">Essential Expenses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Food & Groceries
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  defaultValue="500"
                  {...register('expenses.food')}
                  className="flex-1 h-3 bg-board-light rounded-lg appearance-none cursor-pointer accent-chalk-green"
                />
                <div className="w-24 text-right">
                  <span className="text-xl font-chalk text-chalk-yellow">
                    ${watch('expenses.food') || 500}
                  </span>
                </div>
              </div>
              <p className="text-chalk-blue text-xs mt-1 font-casual">
                Typical: $300-$800/month
              </p>
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Transport
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  defaultValue="200"
                  {...register('expenses.transport')}
                  className="flex-1 h-3 bg-board-light rounded-lg appearance-none cursor-pointer accent-chalk-green"
                />
                <div className="w-24 text-right">
                  <span className="text-xl font-chalk text-chalk-yellow">
                    ${watch('expenses.transport') || 200}
                  </span>
                </div>
              </div>
              <p className="text-chalk-blue text-xs mt-1 font-casual">
                Typical: $100-$300/month
              </p>
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Utilities
              </label>
              <input
                type="number"
                {...register('expenses.utilities', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="50"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Insurance Premiums
              </label>
              <input
                type="number"
                {...register('expenses.insurance', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="50"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle Expenses */}
        <div>
          <h4 className="text-xl font-chalk text-chalk-yellow mb-4">Lifestyle Expenses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Entertainment
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  defaultValue="300"
                  {...register('expenses.entertainment')}
                  className="flex-1 h-3 bg-board-light rounded-lg appearance-none cursor-pointer accent-chalk-pink"
                />
                <div className="w-24 text-right">
                  <span className="text-xl font-chalk text-chalk-yellow">
                    ${watch('expenses.entertainment') || 300}
                  </span>
                </div>
              </div>
              <p className="text-chalk-blue text-xs mt-1 font-casual">
                Typical: $100-$500/month
              </p>
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Shopping
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  defaultValue="200"
                  {...register('expenses.shopping')}
                  className="flex-1 h-3 bg-board-light rounded-lg appearance-none cursor-pointer accent-chalk-pink"
                />
                <div className="w-24 text-right">
                  <span className="text-xl font-chalk text-chalk-yellow">
                    ${watch('expenses.shopping') || 200}
                  </span>
                </div>
              </div>
              <p className="text-chalk-blue text-xs mt-1 font-casual">
                Typical: $100-$400/month
              </p>
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Parent Support
              </label>
              <input
                type="number"
                {...register('expenses.parentSupport', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-chalk-white font-casual mb-2">
                Children Education
              </label>
              <input
                type="number"
                {...register('expenses.childrenEducation', { min: 0 })}
                className="chalk-input w-full"
                placeholder="0"
                step="100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Savings Rate Indicator */}
      <div className="mt-8 p-4 border-2 border-chalk-green border-dashed rounded-lg">
        <h4 className="text-chalk-green font-chalk text-xl mb-2">
          💰 Savings Guidelines
        </h4>
        <ul className="space-y-1 text-chalk-white font-casual">
          <li>• Aim for 20% minimum savings rate</li>
          <li>• 50/30/20 rule: Needs/Wants/Savings</li>
          <li>• Build 6-month emergency fund first</li>
          <li>• Automate savings transfers</li>
        </ul>
      </div>
    </div>
  );
}