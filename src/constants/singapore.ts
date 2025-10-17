/**
 * Singapore-specific constants and configurations
 * Data sources: CPF Board, HDB, LTA, MAS, data.gov.sg
 * Last updated: October 2024
 */

// ============================================
// CPF CONFIGURATIONS
// ============================================

export const CPF_CONTRIBUTION_RATES = {
  // Employee rates by age (percentage of wage)
  employee: {
    '<=35': 20,
    '36-45': 20,
    '46-50': 20,
    '51-55': 19,
    '56-60': 15,
    '61-65': 9.5,
    '>65': 7
  },
  // Employer rates by age
  employer: {
    '<=35': 17,
    '36-45': 17,
    '46-50': 17,
    '51-55': 16,
    '56-60': 13,
    '61-65': 9,
    '>65': 7.5
  },
  // Allocation to different accounts (% of total contribution)
  allocation: {
    '<=35': { OA: 0.6217, SA: 0.1622, MA: 0.2161 },
    '36-45': { OA: 0.5676, SA: 0.1892, MA: 0.2432 },
    '46-50': { OA: 0.5135, SA: 0.2162, MA: 0.2703 },
    '51-55': { OA: 0.4054, SA: 0.3108, MA: 0.2838 },
    '56-60': { OA: 0.4615, SA: 0.1154, MA: 0.4231 },
    '61-65': { OA: 0.0263, SA: 0.2105, MA: 0.7632 },
    '>65': { OA: 0.08, SA: 0.08, MA: 0.84 }
  },
  // CPF salary ceiling
  ordinaryWageCeiling: 6000,
  additionalWageCeiling: 102000,
  // Interest rates (per annum)
  interestRates: {
    OA: 0.025,  // 2.5%
    SA: 0.04,   // 4%
    MA: 0.04,   // 4%
    RA: 0.04,   // 4%
    extraInterestFirst60k: 0.01, // Extra 1% on first $60k
    extraInterestFirst30k_above55: 0.02 // Extra 2% for age 55+
  }
};

// CPF LIFE payout options
export const CPF_LIFE = {
  plans: {
    BASIC: {
      name: 'CPF LIFE Basic',
      description: 'Lower monthly payouts, higher bequest'
    },
    STANDARD: {
      name: 'CPF LIFE Standard',
      description: 'Balanced monthly payouts and bequest'
    },
    ESCALATING: {
      name: 'CPF LIFE Escalating',
      description: 'Payouts increase by 2% annually'
    }
  },
  minimumSum: {
    FRS: 205800,  // Full Retirement Sum (2024)
    BRS: 102900,  // Basic Retirement Sum (2024)
    ERS: 308700   // Enhanced Retirement Sum (2024)
  }
};

// ============================================
// HDB & HOUSING
// ============================================

export const HDB_GRANTS = {
  // Enhanced CPF Housing Grant (Income ceiling applies)
  enhancedHousingGrant: {
    singles: {
      '<=1500': 40000,
      '1501-2000': 35000,
      '2001-2500': 30000,
      '2501-3000': 25000,
      '3001-3500': 20000,
      '3501-4000': 15000,
      '4001-4500': 10000
    },
    families: {
      '<=1500': 80000,
      '1501-2000': 75000,
      '2001-2500': 70000,
      '2501-3000': 65000,
      '3001-3500': 60000,
      '3501-4000': 55000,
      '4001-4500': 50000,
      '4501-5000': 45000,
      '5001-5500': 40000,
      '5501-6000': 35000,
      '6001-6500': 30000,
      '6501-7000': 25000,
      '7001-7500': 20000,
      '7501-8000': 15000,
      '8001-8500': 10000,
      '8501-9000': 5000
    }
  },
  // Proximity Grant
  proximityGrant: {
    livingWithParents: 30000,
    livingNearParents: 20000  // Within 4km
  },
  // Singles Grant
  singlesGrant: {
    '2-room': 15000,
    '3-room': 10000,
    '4-room': 5000
  },
  // Step-Up Grant
  stepUpGrant: {
    '2-to-3-room': 15000,
    '2-to-4-room': 15000,
    '3-to-4-room': 15000,
    '3-to-5-room': 15000,
    '4-to-5-room': 15000
  }
};

export const HDB_LOAN_LIMITS = {
  loanToValue: 0.8,  // 80% LTV for HDB loan
  interestRate: 0.026, // 2.6% per annum (HDB concessionary rate)
  maxLoanTenure: 25, // years
  MSR: 0.3, // Mortgage Servicing Ratio (30% of gross monthly income)
};

export const PROPERTY_STAMP_DUTY = {
  BSD: [ // Buyer's Stamp Duty
    { upTo: 180000, rate: 0.01 },
    { upTo: 360000, rate: 0.02 },
    { upTo: 1000000, rate: 0.03 },
    { upTo: Infinity, rate: 0.04 }
  ],
  ABSD: { // Additional Buyer's Stamp Duty
    singaporean: {
      first: 0,
      second: 0.2,  // 20%
      third: 0.3    // 30%
    },
    pr: {
      first: 0.05,  // 5%
      second: 0.3,  // 30%
      third: 0.35   // 35%
    },
    foreigner: {
      any: 0.6      // 60%
    }
  }
};

// ============================================
// TRANSPORTATION (COE & VEHICLES)
// ============================================

export const COE_CATEGORIES = {
  A: {
    name: 'Category A',
    description: 'Cars ≤1600cc & ≤130bhp',
    currentPrice: 90000,  // Will be updated from API
    historicalAverage: 75000
  },
  B: {
    name: 'Category B',
    description: 'Cars >1600cc or >130bhp',
    currentPrice: 105000,
    historicalAverage: 90000
  },
  C: {
    name: 'Category C',
    description: 'Goods vehicles & buses',
    currentPrice: 70000,
    historicalAverage: 60000
  },
  D: {
    name: 'Category D',
    description: 'Motorcycles',
    currentPrice: 10000,
    historicalAverage: 8000
  },
  E: {
    name: 'Category E',
    description: 'Open category',
    currentPrice: 106000,
    historicalAverage: 91000
  }
};

export const VEHICLE_COSTS = {
  roadTax: {
    '<=600cc': 400,
    '601-1000cc': 600,
    '1001-1600cc': 900,
    '1601-3000cc': 1500,
    '>3000cc': 2500
  },
  arf: 0.2,  // 20% of Open Market Value
  registrationFee: 220,
  vehicularEmissions: {
    A1: -25000,  // Rebate
    A2: -15000,
    B: 0,
    C1: 15000,  // Surcharge
    C2: 25000
  },
  coeValidity: 10  // years
};

// ============================================
// EDUCATION COSTS
// ============================================

export const EDUCATION_COSTS = {
  preschool: {
    anchorOperator: { min: 150, max: 350 },
    private: { min: 500, max: 2000 }
  },
  primary: {
    school: { annual: 13 },  // Miscellaneous fees
    uniforms: { annual: 200 },
    books: { annual: 300 },
    enrichment: { monthly: { min: 200, max: 1000 } }
  },
  secondary: {
    school: { annual: 20 },
    uniforms: { annual: 250 },
    books: { annual: 400 },
    enrichment: { monthly: { min: 300, max: 1500 } }
  },
  juniorCollege: {
    school: { annual: 24 },
    uniforms: { annual: 300 },
    books: { annual: 500 },
    tuition: { monthly: { min: 400, max: 2000 } }
  },
  polytechnic: {
    singaporean: { annual: 2900 },
    pr: { annual: 5800 },
    international: { annual: 10400 }
  },
  university: {
    NUS_NTU_SMU: {
      singaporean: { annual: 8200 },
      pr: { annual: 11500 },
      international: { annual: 30000 }
    },
    SIT_SUSS: {
      singaporean: { annual: 7500 },
      pr: { annual: 10500 },
      international: { annual: 25000 }
    },
    SUTD: {
      singaporean: { annual: 13200 },
      pr: { annual: 18500 },
      international: { annual: 35000 }
    }
  }
};

// ============================================
// NATIONAL SERVICE
// ============================================

export const NATIONAL_SERVICE = {
  duration: {
    army: 24,  // months
    navy: 24,
    airforce: 24,
    police: 24,
    scdf: 24
  },
  allowance: {
    recruit: 630,
    private: 650,
    lcp: 700,
    corporal: 760,
    cfc: 780,
    '3sg': 950,
    '2sg': 1050,
    '1sg': 1170,
    ssg: 1280,
    msg: 1410,
    '3wo': 1510,
    '2wo': 1640,
    '1wo': 1770,
    mwo: 1820,
    swo: 1910,
    cwo: 2010
  },
  ipptIncentive: {
    gold: 500,
    silver: 300,
    pass: 200
  },
  reservist: {
    cycles: 10,
    completionAge: {
      officer: 50,
      wospec: 50,
      enlistee: 40
    },
    makeUpPay: {
      selfEmployed: 276,  // per day
      employee: 'salary'  // Employer claims from MINDEF
    }
  }
};

// ============================================
// INSURANCE
// ============================================

export const INSURANCE = {
  medishieldLife: {
    premiums: {
      '0-20': 155,
      '21-40': 310,
      '41-50': 465,
      '51-60': 730,
      '61-65': 965,
      '66-70': 1320,
      '71-73': 1575,
      '74-75': 1730,
      '76-78': 1965,
      '79-80': 2185,
      '81-83': 2485,
      '84-85': 2755,
      '86-88': 3015,
      '89-90': 3165,
      '>90': 3415
    },
    deductible: {
      classC: 1500,
      classB2: 2000,
      classB1: 2500,
      classA: 3500
    },
    coInsurance: 0.1  // 10%
  },
  careshieldLife: {
    entryAge: 30,
    monthlyPayout: 600,  // Severe disability
    premiums: {
      male: {
        '30': 206,
        '40': 298,
        '50': 466,
        '60': 815
      },
      female: {
        '30': 253,
        '40': 367,
        '50': 575,
        '60': 1011
      }
    }
  }
};

// ============================================
// TAXES
// ============================================

export const INCOME_TAX = {
  rates: [
    { upTo: 20000, rate: 0 },
    { upTo: 30000, rate: 0.02 },
    { upTo: 40000, rate: 0.035 },
    { upTo: 80000, rate: 0.07 },
    { upTo: 120000, rate: 0.115 },
    { upTo: 160000, rate: 0.15 },
    { upTo: 200000, rate: 0.18 },
    { upTo: 240000, rate: 0.19 },
    { upTo: 280000, rate: 0.195 },
    { upTo: 320000, rate: 0.20 },
    { upTo: 500000, rate: 0.22 },
    { upTo: 1000000, rate: 0.23 },
    { upTo: Infinity, rate: 0.24 }
  ],
  reliefs: {
    earned: 1000,
    parent: 9000,
    handicappedParent: 14000,
    grandparent: 5500,
    handicappedGrandparent: 10000,
    spouse: 2000,
    handicappedSpouse: 5500,
    child: 4000,
    handicappedChild: 7500,
    workingMother: 'percentage',  // Based on child order
    courseFeesRelief: 5500,
    nsMan: 3000,
    nsWife: 750
  }
};

// ============================================
// SAVINGS & INVESTMENTS
// ============================================

export const SAVINGS_BONDS = {
  singaporeSavingsBonds: {
    minInvestment: 500,
    maxInvestment: 200000,
    tenure: 10,  // years
    currentRate: 0.032,  // 3.2% average
    redemptionPenalty: 0
  },
  tBills: {
    minInvestment: 1000,
    tenures: [6, 12],  // months
    currentYield: 0.038  // 3.8%
  }
};

export const RETIREMENT_AGES = {
  statutory: 63,
  reEmployment: 68,
  cpfPayoutEligibility: 65,
  cpfWithdrawalAge: 55
};

// ============================================
// LIFESTYLE COSTS
// ============================================

export const LIFESTYLE_COSTS = {
  food: {
    hawker: { min: 3.5, max: 6 },
    coffeeshop: { min: 5, max: 10 },
    foodcourt: { min: 7, max: 12 },
    restaurant: { min: 20, max: 50 },
    fineDining: { min: 80, max: 200 }
  },
  transport: {
    publicTransport: {
      adult: { monthly: 128 },
      senior: { monthly: 64 },
      student: { monthly: 52 }
    },
    taxi: {
      flagDown: 3.9,
      perKm: 0.65,
      peakHour: 1.25  // multiplier
    },
    privateHire: {
      baseFare: 2.5,
      perKm: 0.55,
      perMin: 0.16
    }
  },
  utilities: {
    electricity: { kwhRate: 0.2739 },
    water: { cubicMeterRate: 2.74 },
    gas: { kwhRate: 0.2094 }
  },
  telecommunications: {
    mobile: { min: 20, max: 100 },
    broadband: { min: 40, max: 80 },
    cable: { min: 30, max: 60 }
  }
};

// ============================================
// INFLATION & ECONOMIC INDICATORS
// ============================================

export const ECONOMIC_INDICATORS = {
  inflation: {
    historical10Year: 0.023,  // 2.3%
    coreInflation: 0.019,      // 1.9%
    forecast: 0.025            // 2.5%
  },
  salaryGrowth: {
    median: 0.04,              // 4%
    professional: 0.05,        // 5%
    managerial: 0.06          // 6%
  },
  propertyAppreciation: {
    hdb: 0.035,               // 3.5%
    privateCondo: 0.04,       // 4%
    landed: 0.045             // 4.5%
  }
};

// ============================================
// FINANCIAL DATA SOURCES
// ============================================

export const DATA_SOURCES = {
  government: {
    dataGovSG: 'https://api.data.gov.sg/v1',
    cpfBoard: 'https://www.cpf.gov.sg/api',
    hdb: 'https://data.gov.sg/dataset/resale-flat-prices',
    iras: 'https://www.iras.gov.sg/api',
    mas: 'https://secure.mas.gov.sg/api',
    singstat: 'https://www.singstat.gov.sg/api',
    lta: 'https://datamall2.mytransport.sg/ltaodataservice'
  },
  financial: {
    sgx: 'https://api.sgx.com',
    bankingSG: 'https://www.abs.org.sg/api',
    moneySense: 'https://www.moneysense.gov.sg/api',
    moneyOwl: 'https://www.moneyowl.com.sg/api',
    seedly: 'https://api.seedly.sg',
    moneySmart: 'https://www.moneysmart.sg/api'
  },
  market: {
    propertyGuru: 'https://www.propertyguru.com.sg/api',
    ninetynine: 'https://www.99.co/api',
    carousell: 'https://www.carousell.sg/api',
    sgCarMart: 'https://www.sgcarmart.com/api'
  },
  educational: {
    wokeSalaryman: 'https://thewokesalaryman.com/feed',
    investmentMoats: 'https://investmentmoats.com/feed',
    drWealth: 'https://drwealth.com/feed'
  }
};

// ============================================
// AGE MILESTONES
// ============================================

export const AGE_MILESTONES = {
  education: {
    preschool: 3,
    primary: 7,
    secondary: 13,
    postsecondary: 17,
    university: 19,
    graduation: 23
  },
  legal: {
    minWorkAge: 13,
    consentAge: 16,
    drivingAge: 18,
    votingAge: 21,
    cpfContribution: 17,
    hdbSingles: 35
  },
  career: {
    internship: 20,
    firstJob: 23,
    midCareer: 35,
    peakEarning: 45,
    preRetirement: 55
  },
  retirement: {
    cpfWithdrawal: 55,
    reEmployment: 63,
    cpfPayout: 65,
    fullRetirement: 68
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateCPFContribution(
  age: number,
  salary: number
): {
  employee: number;
  employer: number;
  total: number;
  allocation: { OA: number; SA: number; MA: number };
} {
  const ageGroup = getAgeGroup(age);
  const cappedSalary = Math.min(salary, CPF_CONTRIBUTION_RATES.ordinaryWageCeiling);

  const employeeContribution = cappedSalary * (CPF_CONTRIBUTION_RATES.employee[ageGroup] / 100);
  const employerContribution = cappedSalary * (CPF_CONTRIBUTION_RATES.employer[ageGroup] / 100);
  const total = employeeContribution + employerContribution;

  const allocation = CPF_CONTRIBUTION_RATES.allocation[ageGroup];

  return {
    employee: employeeContribution,
    employer: employerContribution,
    total,
    allocation: {
      OA: total * allocation.OA,
      SA: total * allocation.SA,
      MA: total * allocation.MA
    }
  };
}

export function getAgeGroup(age: number): keyof typeof CPF_CONTRIBUTION_RATES.employee {
  if (age <= 35) return '<=35';
  if (age <= 45) return '36-45';
  if (age <= 50) return '46-50';
  if (age <= 55) return '51-55';
  if (age <= 60) return '56-60';
  if (age <= 65) return '61-65';
  return '>65';
}

export function calculateIncomeTax(annualIncome: number, reliefs: number = 0): number {
  const taxableIncome = Math.max(0, annualIncome - reliefs);
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of INCOME_TAX.rates) {
    const taxableInBracket = Math.min(taxableIncome, bracket.upTo) - previousLimit;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    if (taxableIncome <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  return tax;
}

export function adjustForInflation(
  amount: number,
  years: number,
  inflationRate: number = ECONOMIC_INDICATORS.inflation.historical10Year
): number {
  return amount * Math.pow(1 + inflationRate, years);
}

export default {
  CPF_CONTRIBUTION_RATES,
  CPF_LIFE,
  HDB_GRANTS,
  HDB_LOAN_LIMITS,
  PROPERTY_STAMP_DUTY,
  COE_CATEGORIES,
  VEHICLE_COSTS,
  EDUCATION_COSTS,
  NATIONAL_SERVICE,
  INSURANCE,
  INCOME_TAX,
  SAVINGS_BONDS,
  RETIREMENT_AGES,
  LIFESTYLE_COSTS,
  ECONOMIC_INDICATORS,
  DATA_SOURCES,
  AGE_MILESTONES,
  calculateCPFContribution,
  calculateIncomeTax,
  adjustForInflation
};