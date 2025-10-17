/**
 * User Profile Types
 * Comprehensive financial and personal data structure
 */

// ============================================
// PERSONAL INFORMATION
// ============================================

export interface PersonalInfo {
  // Basic Info
  name: string;
  dateOfBirth: Date;
  age: number;
  gender: 'male' | 'female';
  nationality: 'singaporean' | 'pr' | 'foreigner';

  // Contact (optional)
  email?: string;
  phone?: string;

  // Family Status
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  numberOfChildren: number;
  childrenAges?: number[];

  // Health
  healthConditions?: string[];
  smoker: boolean;
  exerciseFrequency: 'never' | 'rarely' | 'weekly' | 'daily';

  // NS Status (for males)
  nsStatus?: 'pre-enlistment' | 'serving' | 'reservist' | 'completed';
  nsCompletionDate?: Date;
  vocation?: string;
}

// ============================================
// CURRENT FINANCIAL STATUS
// ============================================

export interface CurrentFinancials {
  // Monthly Income
  monthlyIncome: {
    basic: number;
    allowances: number;
    bonus: number;  // Annual bonus divided by 12
    commission: number;
    rental: number;
    dividends: number;
    other: number;
    total: number;  // Calculated field
  };

  // CPF Balances (User inputs current amounts)
  cpfBalances: {
    ordinary: number;      // OA - Housing, investments, education
    special: number;       // SA - Retirement
    medisave: number;     // MA - Healthcare
    retirement?: number;   // RA - Only for 55+
    total: number;        // Calculated field
  };

  // Cash & Investments
  cashAndInvestments: {
    // Cash
    savingsAccount: number;
    currentAccount: number;
    fixedDeposits: number;

    // Investments
    stocks: {
      singapore: number;
      international: number;
    };
    bonds: {
      singaporeSavingsBonds: number;
      corporateBonds: number;
      tBills: number;
    };
    unitTrusts: number;
    etfs: number;
    cryptocurrency: number;
    gold: number;

    // Retirement Accounts
    srs: number;  // Supplementary Retirement Scheme

    // Others
    roboAdvisors: number;
    p2pLending: number;
    business: number;
    others: number;

    total: number;  // Calculated field
  };

  // Insurance Policies
  insurance: {
    life: InsurancePolicy[];
    health: InsurancePolicy[];
    criticalIllness: InsurancePolicy[];
    disability: InsurancePolicy[];
    investment: InsurancePolicy[];
    endowment: InsurancePolicy[];
    totalPremiumMonthly: number;  // Calculated
    totalCoverage: number;  // Calculated
  };

  // Properties
  properties: Property[];

  // Vehicles
  vehicles: Vehicle[];

  // Other Assets
  otherAssets: {
    jewelry: number;
    art: number;
    collectibles: number;
    businessEquity: number;
    intellectualProperty: number;
    others: number;
    total: number;
  };

  // Total Net Worth (Calculated)
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

// ============================================
// CURRENT LIABILITIES
// ============================================

export interface CurrentLiabilities {
  // Property Loans
  mortgages: Mortgage[];

  // Vehicle Loans
  carLoans: CarLoan[];

  // Personal Loans
  personalLoans: PersonalLoan[];

  // Credit Cards
  creditCards: CreditCard[];

  // Education Loans
  educationLoans: EducationLoan[];

  // Other Debts
  otherDebts: {
    familyLoans: number;
    businessLoans: number;
    renovationLoans: number;
    others: number;
  };

  // Monthly Commitments
  monthlyCommitments: {
    mortgages: number;
    carLoans: number;
    personalLoans: number;
    creditCardMinimum: number;
    educationLoans: number;
    insurance: number;
    utilities: number;
    telecommunication: number;
    subscriptions: number;
    parentSupport: number;
    childrenEducation: number;
    others: number;
    total: number;  // Calculated
  };

  // Debt Ratios (Calculated)
  totalDebtServiceRatio: number;  // TDSR
  mortgageServiceRatio: number;   // MSR
}

// ============================================
// SUPPORTING INTERFACES
// ============================================

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  type: 'term' | 'whole' | 'endowment' | 'investment-linked' | 'critical-illness' | 'disability' | 'medical';
  insurer: string;
  policyName: string;
  sumAssured: number;
  premiumMonthly: number;
  premiumFrequency: 'monthly' | 'quarterly' | 'annually';
  startDate: Date;
  maturityDate?: Date;
  cashValue?: number;
  riders?: string[];
}

export interface Property {
  id: string;
  type: 'hdb' | 'condo' | 'landed' | 'commercial';
  address: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: Date;

  // HDB Specific
  hdbDetails?: {
    flatType: '2-room' | '3-room' | '4-room' | '5-room' | 'executive' | 'maisonette';
    leaseStartDate: Date;
    remainingLease: number;
    mop?: Date;  // Minimum Occupation Period
    grants?: string[];
  };

  // Financing
  financing: {
    downpayment: number;
    cpfUsed: number;
    cashUsed: number;
    loanAmount: number;
    loanBalance: number;
    monthlyPayment: number;
    interestRate: number;
    loanTenure: number;
    bank: string;
  };

  // Rental (if applicable)
  rental?: {
    isRented: boolean;
    monthlyRental: number;
    tenantSince?: Date;
    leaseExpiry?: Date;
  };
}

export interface Vehicle {
  id: string;
  type: 'car' | 'motorcycle' | 'commercial';
  make: string;
  model: string;
  year: number;

  // Purchase Details
  purchasePrice: number;
  coePrice: number;
  coeExpiryDate: Date;
  currentValue: number;

  // Financing
  financing?: {
    loanAmount: number;
    loanBalance: number;
    monthlyPayment: number;
    interestRate: number;
    loanTenure: number;
  };

  // Running Costs
  runningCosts: {
    roadTax: number;
    insurance: number;
    petrol: number;
    parking: number;
    maintenance: number;
    erp: number;
    totalMonthly: number;
  };
}

export interface Mortgage {
  id: string;
  propertyId: string;
  bank: string;
  loanAmount: number;
  outstandingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  remainingTenure: number;
  isHdbLoan: boolean;
}

export interface CarLoan {
  id: string;
  vehicleId: string;
  bank: string;
  loanAmount: number;
  outstandingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  remainingTenure: number;
}

export interface PersonalLoan {
  id: string;
  purpose: string;
  bank: string;
  loanAmount: number;
  outstandingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  remainingTenure: number;
}

export interface CreditCard {
  id: string;
  bank: string;
  cardType: string;
  creditLimit: number;
  outstandingBalance: number;
  minimumPayment: number;
  interestRate: number;
  annualFee: number;
}

export interface EducationLoan {
  id: string;
  institution: string;
  course: string;
  loanAmount: number;
  outstandingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  remainingTenure: number;
  gracePeriod?: Date;
}

// ============================================
// MONTHLY EXPENSES
// ============================================

export interface MonthlyExpenses {
  // Fixed Expenses
  fixed: {
    mortgage: number;
    carLoan: number;
    insurance: number;
    propertyTax: number;
    utilities: number;
    internet: number;
    mobile: number;
    subscriptions: number;
    maid?: number;
  };

  // Variable Expenses
  variable: {
    food: {
      groceries: number;
      diningOut: number;
      delivery: number;
    };
    transport: {
      publicTransport: number;
      taxi: number;
      petrol: number;
      parking: number;
      erp: number;
    };
    personal: {
      clothing: number;
      grooming: number;
      healthcare: number;
      fitness: number;
    };
    family: {
      childcare: number;
      education: number;
      tuition: number;
      enrichment: number;
      parentSupport: number;
    };
    lifestyle: {
      entertainment: number;
      hobbies: number;
      travel: number;
      gifts: number;
    };
  };

  // Savings & Investments
  savingsAndInvestments: {
    emergencyFund: number;
    cpfTopUp: number;
    srs: number;
    stocks: number;
    bonds: number;
    unitTrusts: number;
    others: number;
  };

  // Total (Calculated)
  totalFixed: number;
  totalVariable: number;
  totalSavings: number;
  totalExpenses: number;
}

// ============================================
// GOALS & PREFERENCES
// ============================================

export interface GoalsAndPreferences {
  // Retirement
  retirement: {
    targetAge: number;
    monthlyIncomeNeeded: number;
    expectedLifespan: number;
    cpfLifePlan?: 'basic' | 'standard' | 'escalating';
  };

  // Major Purchases
  majorPurchases: {
    property?: {
      type: 'hdb' | 'condo' | 'landed';
      targetAge: number;
      budgetMin: number;
      budgetMax: number;
    };
    car?: {
      targetAge: number;
      carType: 'sedan' | 'suv' | 'hybrid' | 'electric';
      budget: number;
    };
  };

  // Children's Education
  childrenEducation?: {
    local: boolean;
    overseas: boolean;
    targetUniversity?: string;
    estimatedCostPerChild: number;
  };

  // Risk Profile
  riskProfile: {
    investmentRisk: 'conservative' | 'moderate' | 'aggressive';
    insuranceCoverage: 'basic' | 'comprehensive' | 'premium';
    emergencyFundMonths: number;
  };

  // Life Priorities (1-10 scale)
  priorities: {
    wealth: number;
    family: number;
    career: number;
    health: number;
    experiences: number;
    giving: number;
    security: number;
  };
}

// ============================================
// COMPLETE USER PROFILE
// ============================================

export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // All sections
  personal: PersonalInfo;
  financials: CurrentFinancials;
  liabilities: CurrentLiabilities;
  expenses: MonthlyExpenses;
  goals: GoalsAndPreferences;

  // Calculated Metrics
  metrics: {
    liquidityRatio: number;      // Liquid assets / Monthly expenses
    savingsRate: number;          // Savings / Income
    debtToIncomeRatio: number;   // Total debt payments / Income
    netWorthGrowthRate: number;  // YoY net worth growth
    fireNumber: number;          // 25x annual expenses
    yearsToRetirement: number;   // Based on current trajectory
  };

  // Recommendations (Generated)
  recommendations?: {
    immediate: string[];
    shortTerm: string[];  // 1-2 years
    mediumTerm: string[]; // 3-5 years
    longTerm: string[];   // 5+ years
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateNetWorth(profile: UserProfile): number {
  const assets =
    profile.financials.cpfBalances.total +
    profile.financials.cashAndInvestments.total +
    profile.financials.properties.reduce((sum, p) => sum + p.currentValue, 0) +
    profile.financials.vehicles.reduce((sum, v) => sum + v.currentValue, 0) +
    profile.financials.otherAssets.total;

  const liabilities =
    profile.liabilities.mortgages.reduce((sum, m) => sum + m.outstandingBalance, 0) +
    profile.liabilities.carLoans.reduce((sum, c) => sum + c.outstandingBalance, 0) +
    profile.liabilities.personalLoans.reduce((sum, p) => sum + p.outstandingBalance, 0) +
    profile.liabilities.creditCards.reduce((sum, c) => sum + c.outstandingBalance, 0) +
    profile.liabilities.educationLoans.reduce((sum, e) => sum + e.outstandingBalance, 0) +
    Object.values(profile.liabilities.otherDebts).reduce((sum, d) => sum + d, 0);

  return assets - liabilities;
}

export function calculateTDSR(profile: UserProfile): number {
  const monthlyDebtPayments = profile.liabilities.monthlyCommitments.total;
  const monthlyIncome = profile.financials.monthlyIncome.total;
  return (monthlyDebtPayments / monthlyIncome) * 100;
}

export function calculateSavingsRate(profile: UserProfile): number {
  const monthlyIncome = profile.financials.monthlyIncome.total;
  const monthlyExpenses = profile.expenses.totalExpenses;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  return (monthlySavings / monthlyIncome) * 100;
}

export function canAffordProperty(
  profile: UserProfile,
  propertyPrice: number,
  downpaymentPercent: number = 0.25
): boolean {
  const downpayment = propertyPrice * downpaymentPercent;
  const loanAmount = propertyPrice - downpayment;
  const monthlyPayment = calculateMonthlyMortgage(loanAmount, 0.026, 25);

  // Check TDSR (55% max)
  const newTDSR = ((profile.liabilities.monthlyCommitments.total + monthlyPayment) /
                   profile.financials.monthlyIncome.total) * 100;

  // Check if have enough for downpayment
  const liquidAssets = profile.financials.cashAndInvestments.savingsAccount +
                      profile.financials.cpfBalances.ordinary;

  return newTDSR <= 55 && liquidAssets >= downpayment;
}

function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export default UserProfile;