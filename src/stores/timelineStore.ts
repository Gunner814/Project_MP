import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Predefined colors for scenarios (cycles through if more scenarios created)
export const SCENARIO_COLORS = [
  { id: 'blue', name: 'Ocean Blue', color: '#66d9ef', dark: '#4db8d9' },
  { id: 'green', name: 'Forest Green', color: '#a6e22e', dark: '#8bc621' },
  { id: 'pink', name: 'Cherry Pink', color: '#ff6b9d', dark: '#e5518a' },
  { id: 'purple', name: 'Royal Purple', color: '#ae81ff', dark: '#9b6ce6' },
  { id: 'orange', name: 'Sunset Orange', color: '#fd971f', dark: '#e87d0c' },
  { id: 'yellow', name: 'Golden Yellow', color: '#ffeb3b', dark: '#fdd835' },
  { id: 'red', name: 'Ruby Red', color: '#f92672', dark: '#e01558' },
  { id: 'cyan', name: 'Sky Cyan', color: '#00bcd4', dark: '#0097a7' },
];

// Cost frequency types
export type CostFrequency = 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

// Flexible cost structure supporting all time periods
export interface FlexibleCost {
  amount?: number;
  frequency?: CostFrequency;
  customPeriodDays?: number; // For custom frequency (e.g., every 14 days)
  duration?: number; // How many periods it repeats (undefined = forever/until endAge)
  startAge?: number; // When it starts (defaults to module age)
  endAge?: number; // When it ends (optional)

  // Legacy fields for backward compatibility
  oneTime?: number; // DEPRECATED: use amount + frequency: 'one-time'
  monthly?: number; // DEPRECATED: use amount + frequency: 'monthly'

  // Special fields
  cpfUsage?: number; // Percentage of CPF used (for housing)
  grants?: number; // Government grants received
  cpfDeduction?: number; // Amount to deduct from CPF OA
  cashRequired?: number; // Cash amount required
}

// Salary change for job modules
export interface SalaryChange {
  type: 'replace' | 'add' | 'multiply'; // replace = new job, add = side hustle, multiply = promotion
  amount: number; // New salary, additional income, or multiplier (e.g., 1.20 for 20% raise)
}

// Types for timeline items
export interface TimelineModule {
  id: string;
  type: 'car' | 'house' | 'marriage' | 'child' | 'education' | 'investment' | 'career' | 'retirement' | 'custom';
  name: string;
  age: number; // Age when this happens
  year: number; // Actual year
  costs: FlexibleCost;
  income?: FlexibleCost; // Can now have flexible income too!
  salaryChange?: SalaryChange; // For job-related modules that modify income
  icon?: string;
  color?: string;
  removable: boolean;
  isCustom?: boolean; // Marks user-created custom modules
  description?: string; // Optional description for custom modules
  category?: string; // For grouping custom modules
}

// Scenario/Branch type
export interface ScenarioColor {
  id: string;
  name: string;
  color: string;
  dark: string;
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  color: ScenarioColor; // Predefined or custom color
  branchedFrom?: string; // Parent scenario ID
  branchAge?: number; // Age where this scenario diverged
  createdAt: string;
  modules: TimelineModule[];
  financial: FinancialState;
}

// Complete Life Plan Profile (for sharing/templates)
export interface CompleteProfile {
  // Profile Metadata
  id: string;
  name: string;
  description: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  version: string; // For compatibility
  isTemplate: boolean; // Community template vs personal profile

  // Tags for discovery
  tags: string[]; // "Conservative", "FIRE", "Family", "Entrepreneur", etc.

  // Complete Life Plan Data
  financial: FinancialState;
  scenarios: Scenario[];
  activeScenarioId: string | null;
  customModules: TimelineModule[];

  // Calculated Stats (for preview)
  stats: {
    retirementAge: number;
    finalNetWorth: number;
    peakCashFlow: number;
    totalLifeEvents: number;
  };
}

export interface FinancialState {
  currentAge: number;
  currentYear: number;
  monthlyIncome: number;
  annualBonus: number;
  salaryGrowthRate: number; // percentage per year
  cpfBalances: {
    ordinary: number;
    special: number;
    medisave: number;
    retirement?: number;
  };
  cashSavings: number;
  investments: number;
  netWorth: number;
}

// Theme types
export type ThemeMode = 'dark' | 'light';

export interface TimelineState {
  // User profile
  userProfile: any;

  // Financial state
  financial: FinancialState;

  // Timeline modules (life events)
  timelineModules: TimelineModule[];

  // Available modules to drag
  availableModules: TimelineModule[];

  // User-created custom modules
  customModules: TimelineModule[];

  // Projections
  projections: {
    year: number;
    age: number;
    netWorth: number;
    cashFlow: number;
    cpfTotal: number;
  }[];

  // Scenario/Branch Management
  scenarios: Scenario[];
  activeScenarioId: string | null;

  // Theme
  theme: ThemeMode;

  // Actions
  setUserProfile: (profile: any) => void;
  updateIncome: (monthlyIncome: number, annualBonus: number) => void;
  updateSalaryGrowthRate: (rate: number) => void;
  updateStartingCapital: (capital: {
    cashSavings?: number;
    cpfOA?: number;
    cpfSA?: number;
    cpfMA?: number;
    investments?: number;
  }) => void;
  addModule: (module: TimelineModule) => void;
  removeModule: (moduleId: string) => void;
  updateModule: (moduleId: string, updates: Partial<TimelineModule>) => void;
  moveModule: (moduleId: string, newAge: number) => void;
  calculateProjections: () => void;
  resetTimeline: () => void;
  loadScenario: (scenario: any) => void;
  saveScenario: (name: string) => void;

  // Scenario/Branch Actions
  createBranch: (name: string, description?: string, customColor?: ScenarioColor, branchAge?: number) => void;
  switchScenario: (scenarioId: string) => void;
  deleteScenario: (scenarioId: string) => void;
  updateScenarioName: (scenarioId: string, name: string) => void;
  updateScenarioColor: (scenarioId: string, color: ScenarioColor) => void;
  duplicateScenario: (scenarioId: string, newName: string) => void;
  getNextDefaultColor: () => ScenarioColor;
  getActiveScenario: () => Scenario | null;

  // Custom Module Actions
  addCustomModule: (module: Omit<TimelineModule, 'id' | 'age' | 'year'>) => void;
  deleteCustomModule: (moduleId: string) => void;
  updateCustomModule: (moduleId: string, updates: Partial<TimelineModule>) => void;

  // Profile Management (Import/Export/Share)
  exportProfile: (profileName: string, description: string, tags: string[]) => CompleteProfile;
  importProfile: (profile: CompleteProfile) => void;
  downloadProfileJSON: (profile: CompleteProfile) => void;
  generateShareCode: (profile: CompleteProfile) => string;
  loadFromShareCode: (code: string) => Promise<CompleteProfile | null>;

  // Theme Actions
  setTheme: (theme: ThemeMode) => void;
}

// Helper function to calculate projections
const calculateProjections = (
  startAge: number,
  financial: FinancialState,
  modules: TimelineModule[]
): any[] => {
  const projections = [];
  const endAge = 123;
  let netWorth = financial.netWorth || 0;
  let monthlyIncome = financial.monthlyIncome;
  let cpfOA = financial.cpfBalances.ordinary;
  let cpfSA = financial.cpfBalances.special;
  let cpfMA = financial.cpfBalances.medisave;
  let cashSavings = financial.cashSavings || 0;

  // Track additional income streams (side hustles, etc)
  let additionalMonthlyIncome = 0;
  let baseSalary = monthlyIncome; // Starting base salary

  for (let age = startAge; age <= endAge; age++) {
    const year = financial.currentYear + (age - startAge);

    // Apply salary growth to base salary only (not side hustles)
    if (age > startAge) {
      baseSalary *= (1 + financial.salaryGrowthRate / 100);
    }

    // Apply modules at this age
    const modulesAtAge = modules.filter(m => m.age === age);

    // Process job/career modules that affect income
    modulesAtAge.forEach(module => {
      if (module.salaryChange) {
        const { type, amount } = module.salaryChange;

        if (type === 'replace') {
          // New job or starting job - replace base salary
          baseSalary = amount;
        } else if (type === 'add') {
          // Side hustle - add to additional income
          additionalMonthlyIncome += amount;
        } else if (type === 'multiply') {
          // Promotion or career break - multiply base salary
          baseSalary *= amount;
        }
      }
    });

    // Calculate total monthly income
    monthlyIncome = baseSalary + additionalMonthlyIncome;

    // Calculate annual income including bonus
    const annualIncome = monthlyIncome * 12 + financial.annualBonus;
    let annualExpenses = 0;
    let oneTimeCosts = 0;
    let cpfDeductions = 0;
    let grantsReceived = 0;

    // Calculate ongoing monthly costs from all active modules
    modules.forEach(module => {
      if (module.age <= age) {
        const moduleEndAge = module.costs.duration
          ? module.age + Math.floor(module.costs.duration / 12)
          : 123;

        if (age <= moduleEndAge) {
          annualExpenses += (module.costs.monthly || 0) * 12;
        }
      }
    });

    // Apply one-time costs and CPF deductions for new modules this year
    modulesAtAge.forEach(module => {
      // Calculate grants and net costs
      const grants = module.costs.grants || 0;
      grantsReceived += grants;

      const grossCost = (module.costs.oneTime || 0) + grants;
      const cpfUsagePercent = module.costs.cpfUsage || 0;

      // For housing, deduct from CPF and cash based on percentage
      if (module.type === 'house' && cpfUsagePercent > 0) {
        const cpfAmount = grossCost * (cpfUsagePercent / 100);
        const cashAmount = grossCost * (1 - cpfUsagePercent / 100);

        // Deduct from CPF OA
        const actualCpfDeduction = Math.min(cpfAmount, cpfOA);
        cpfOA -= actualCpfDeduction;
        cpfDeductions += actualCpfDeduction;

        // Remaining must come from cash
        const cashRequired = cashAmount + (cpfAmount - actualCpfDeduction);
        oneTimeCosts += cashRequired;

        module.costs.cpfDeduction = actualCpfDeduction;
        module.costs.cashRequired = cashRequired;
      } else {
        // Non-housing costs come from cash
        oneTimeCosts += module.costs.oneTime || 0;
      }

      // Add income if any (e.g., Baby Bonus)
      if (module.type === 'child') {
        grantsReceived += 10000; // Baby Bonus cash gift
      }
    });

    // Calculate CPF contributions
    const cpfRate = age <= 35 ? 0.37 : age <= 45 ? 0.37 : age <= 50 ? 0.37 : age <= 55 ? 0.35 : age <= 60 ? 0.28 : age <= 65 ? 0.165 : 0.05;
    const cpfContribution = Math.min(monthlyIncome, 6800) * cpfRate * 12; // Updated CPF ceiling

    // Allocate CPF with proper rates
    const cpfOARate = age <= 35 ? 0.6217 : age <= 45 ? 0.5676 : age <= 50 ? 0.5135 : age <= 55 ? 0.5135 : 0.3514;
    const cpfSARate = age <= 35 ? 0.1622 : age <= 45 ? 0.1892 : age <= 50 ? 0.2162 : age <= 55 ? 0.3108 : 0.3514;
    const cpfMARate = 1 - cpfOARate - cpfSARate;

    cpfOA += cpfContribution * cpfOARate;
    cpfSA += cpfContribution * cpfSARate;
    cpfMA += cpfContribution * cpfMARate;

    // Apply CPF interest rates
    cpfOA *= 1.025; // 2.5% interest
    cpfSA *= 1.04; // 4% interest (up to first $60k)
    cpfMA *= 1.04; // 4% interest

    // Calculate cash flow
    const takehomePay = annualIncome * (1 - cpfRate);
    const cashFlow = takehomePay - annualExpenses - oneTimeCosts + grantsReceived;
    cashSavings += cashFlow;

    // Calculate total net worth
    const totalNetWorth = cashSavings + cpfOA + cpfSA + cpfMA + (financial.investments || 0);

    projections.push({
      year,
      age,
      netWorth: Math.round(totalNetWorth),
      cashFlow: Math.round(cashFlow / 12), // Monthly cash flow
      cpfTotal: Math.round(cpfOA + cpfSA + cpfMA),
      cpfOA: Math.round(cpfOA),
      cpfSA: Math.round(cpfSA),
      cpfMA: Math.round(cpfMA),
      cashSavings: Math.round(cashSavings),
      monthlyIncome: Math.round(monthlyIncome),
      annualExpenses: Math.round(annualExpenses),
      grantsReceived: Math.round(grantsReceived)
    });
  }

  return projections;
};

// Create the store
const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      userProfile: null,

      financial: {
        currentAge: 30,
        currentYear: new Date().getFullYear(),
        monthlyIncome: 5000,
        annualBonus: 10000,
        salaryGrowthRate: 3,
        cpfBalances: {
          ordinary: 50000,
          special: 30000,
          medisave: 20000,
        },
        cashSavings: 20000,
        investments: 10000,
        netWorth: 130000,
      },

      timelineModules: [
        // Auto-placed death module at age 90
        {
          id: `death-${Date.now()}`,
          type: 'custom',
          name: 'End of Life',
          age: 90,
          year: new Date().getFullYear() + 60, // 90 - 30 = 60 years from now
          costs: { oneTime: 0 },
          icon: '🕊️',
          color: '#8a8a8a',
          removable: true,
          description: 'Expected end of life - movable to adjust your planning horizon',
        },
      ],

      // Scenario management
      scenarios: [],
      activeScenarioId: null,

      // Custom modules
      customModules: [],

      // Theme
      theme: 'dark' as ThemeMode,

      availableModules: [
        // Housing - HDB Flats
        {
          id: 'bto-1room',
          type: 'house',
          name: '1-Room BTO',
          age: 0,
          year: 0,
          costs: { oneTime: 25000, monthly: 600, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏠',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'bto-2room',
          type: 'house',
          name: '2-Room BTO',
          age: 0,
          year: 0,
          costs: { oneTime: 40000, monthly: 1000, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏠',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'bto-3room',
          type: 'house',
          name: '3-Room BTO',
          age: 0,
          year: 0,
          costs: { oneTime: 60000, monthly: 1400, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏠',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'bto-4room',
          type: 'house',
          name: '4-Room BTO',
          age: 0,
          year: 0,
          costs: { oneTime: 80000, monthly: 1800, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏠',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'bto-5room',
          type: 'house',
          name: '5-Room BTO',
          age: 0,
          year: 0,
          costs: { oneTime: 100000, monthly: 2200, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏠',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'resale-3room',
          type: 'house',
          name: '3-Room Resale HDB',
          age: 0,
          year: 0,
          costs: { oneTime: 90000, monthly: 1600, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏘️',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'resale-4room',
          type: 'house',
          name: '4-Room Resale HDB',
          age: 0,
          year: 0,
          costs: { oneTime: 120000, monthly: 2200, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏘️',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'resale-5room',
          type: 'house',
          name: '5-Room Resale HDB',
          age: 0,
          year: 0,
          costs: { oneTime: 150000, monthly: 2600, duration: 300, cpfUsage: 80, grants: 0 },
          icon: '🏘️',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'ec',
          type: 'house',
          name: 'Executive Condo',
          age: 0,
          year: 0,
          costs: { oneTime: 200000, monthly: 3200, duration: 300, cpfUsage: 60, grants: 0 },
          icon: '🏗️',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'condo',
          type: 'house',
          name: 'Private Condo',
          age: 0,
          year: 0,
          costs: { oneTime: 250000, monthly: 3800, duration: 300, cpfUsage: 50, grants: 0 },
          icon: '🏢',
          color: '#ff6b9d',
          removable: true,
        },
        {
          id: 'car',
          type: 'car',
          name: 'Car (with COE)',
          age: 0,
          year: 0,
          costs: { oneTime: 120000, monthly: 2000, duration: 120 },
          icon: '🚗',
          color: '#66d9ef',
          removable: true,
        },
        {
          id: 'marriage',
          type: 'marriage',
          name: 'Wedding',
          age: 0,
          year: 0,
          costs: { oneTime: 30000 },
          icon: '💑',
          color: '#ffeb3b',
          removable: true,
        },
        {
          id: 'child1',
          type: 'child',
          name: 'First Child',
          age: 0,
          year: 0,
          costs: { oneTime: 10000, monthly: 1500, duration: 264 }, // 22 years
          icon: '👶',
          color: '#a6e22e',
          removable: true,
        },
        {
          id: 'child2',
          type: 'child',
          name: 'Second Child',
          age: 0,
          year: 0,
          costs: { oneTime: 8000, monthly: 1200, duration: 264 },
          icon: '👶',
          color: '#a6e22e',
          removable: true,
        },
        {
          id: 'child3',
          type: 'child',
          name: 'Third Child',
          age: 0,
          year: 0,
          costs: { oneTime: 7000, monthly: 1100, duration: 264 },
          icon: '👶',
          color: '#a6e22e',
          removable: true,
        },
        {
          id: 'child4',
          type: 'child',
          name: 'Fourth Child',
          age: 0,
          year: 0,
          costs: { oneTime: 6000, monthly: 1000, duration: 264 },
          icon: '👶',
          color: '#a6e22e',
          removable: true,
        },
        {
          id: 'child5',
          type: 'child',
          name: 'Fifth Child',
          age: 0,
          year: 0,
          costs: { oneTime: 5000, monthly: 900, duration: 264 },
          icon: '👶',
          color: '#a6e22e',
          removable: true,
        },
        {
          id: 'masters',
          type: 'education',
          name: 'Masters Degree',
          age: 0,
          year: 0,
          costs: { oneTime: 40000, duration: 24 },
          icon: '🎓',
          color: '#f92672',
          removable: true,
        },
        {
          id: 'business',
          type: 'career',
          name: 'Start Business',
          age: 0,
          year: 0,
          costs: { oneTime: 50000 },
          income: { monthly: 3000 }, // Additional income
          icon: '💼',
          color: '#fd971f',
          removable: true,
        },
        {
          id: 'investment-property',
          type: 'investment',
          name: 'Investment Property',
          age: 0,
          year: 0,
          costs: { oneTime: 300000, monthly: -2000 }, // Negative = rental income
          icon: '🏦',
          color: '#ae81ff',
          removable: true,
        },
        // Health & Medical Emergencies
        {
          id: 'critical-illness-cancer',
          type: 'custom',
          name: 'Critical Illness (Cancer)',
          age: 0,
          year: 0,
          costs: { oneTime: 80000, monthly: 3000, duration: 60 }, // 5 years treatment
          icon: '🏥',
          color: '#f92672',
          removable: true,
          description: 'Cancer diagnosis with treatment costs (typically covered by Critical Illness insurance)',
        },
        {
          id: 'major-surgery',
          type: 'custom',
          name: 'Major Surgery',
          age: 0,
          year: 0,
          costs: { oneTime: 50000, monthly: 1000, duration: 6 }, // 6 months recovery
          icon: '⚕️',
          color: '#f92672',
          removable: true,
          description: 'Major surgical procedure with recovery period',
        },
        {
          id: 'hospitalization',
          type: 'custom',
          name: 'Hospitalization',
          age: 0,
          year: 0,
          costs: { oneTime: 15000 },
          icon: '🏨',
          color: '#ff6b9d',
          removable: true,
          description: 'Hospital stay and medical treatment',
        },
        {
          id: 'chronic-illness',
          type: 'custom',
          name: 'Chronic Illness',
          age: 0,
          year: 0,
          costs: { monthly: 800, duration: 600 }, // Long-term medication (50 years)
          icon: '💊',
          color: '#fd971f',
          removable: true,
          description: 'Ongoing medication and treatment costs',
        },
        {
          id: 'disability',
          type: 'custom',
          name: 'Disability (Income Loss)',
          age: 0,
          year: 0,
          costs: { monthly: 2000, duration: 120 }, // 10 years income reduction
          icon: '♿',
          color: '#f92672',
          removable: true,
          description: 'Income loss due to disability (offset by income protection insurance)',
        },
        // Job & Career Modules
        {
          id: 'starting-job',
          type: 'career',
          name: 'Starting Job',
          age: 0,
          year: 0,
          costs: {},
          salaryChange: { type: 'replace', amount: 5000 },
          icon: '💼',
          color: '#66d9ef',
          removable: true,
          description: 'Your current or starting job - establishes baseline income',
        },
        {
          id: 'change-job',
          type: 'career',
          name: 'Change Job',
          age: 0,
          year: 0,
          costs: {},
          salaryChange: { type: 'replace', amount: 6000 },
          icon: '🔄',
          color: '#66d9ef',
          removable: true,
          description: 'Switch to a new job with different salary',
        },
        {
          id: 'side-hustle',
          type: 'career',
          name: 'Side Hustle',
          age: 0,
          year: 0,
          costs: { oneTime: 5000 }, // Initial setup cost
          salaryChange: { type: 'add', amount: 1500 },
          icon: '💰',
          color: '#a6e22e',
          removable: true,
          description: 'Additional income stream (freelance, part-time, etc)',
        },
        {
          id: 'promotion',
          type: 'career',
          name: 'Promotion',
          age: 0,
          year: 0,
          costs: {},
          salaryChange: { type: 'multiply', amount: 1.20 },
          icon: '📈',
          color: '#a6e22e',
          removable: true,
          description: 'Salary increase (default 20% raise)',
        },
        {
          id: 'career-break',
          type: 'career',
          name: 'Career Break',
          age: 0,
          year: 0,
          costs: {},
          salaryChange: { type: 'multiply', amount: 0 },
          icon: '🏖️',
          color: '#fd971f',
          removable: true,
          description: 'Temporary pause in active income (sabbatical, parental leave)',
        },
        {
          id: 'full-retirement',
          type: 'retirement',
          name: 'Retirement',
          age: 0,
          year: 0,
          costs: {},
          salaryChange: { type: 'multiply', amount: 0 },
          icon: '🏝️',
          color: '#ae81ff',
          removable: true,
          description: 'Stop active income, live off savings and investments',
        },
        // Insurance & Protection Plans
        {
          id: 'term-life-insurance-500k',
          type: 'investment',
          name: 'Term Life Insurance ($500K)',
          age: 0,
          year: 0,
          costs: { monthly: 40, duration: 360 }, // 30 years coverage
          icon: '🛡️',
          color: '#66d9ef',
          removable: true,
          description: 'Term life insurance for death/TPD protection',
        },
        {
          id: 'term-life-insurance-1m',
          type: 'investment',
          name: 'Term Life Insurance ($1M)',
          age: 0,
          year: 0,
          costs: { monthly: 75, duration: 360 },
          icon: '🛡️',
          color: '#66d9ef',
          removable: true,
          description: 'Term life insurance for death/TPD protection',
        },
        {
          id: 'whole-life-insurance',
          type: 'investment',
          name: 'Whole Life Insurance',
          age: 0,
          year: 0,
          costs: { monthly: 300, duration: 300 }, // 25 years premium
          icon: '💼',
          color: '#ae81ff',
          removable: true,
          description: 'Lifetime coverage with savings component',
        },
        {
          id: 'integrated-shield-plan',
          type: 'investment',
          name: 'Integrated Shield Plan',
          age: 0,
          year: 0,
          costs: { monthly: 150, duration: 600 }, // Lifetime
          icon: '🏥',
          color: '#f92672',
          removable: true,
          description: 'Enhanced hospitalization coverage (Private Hospital A/B ward)',
        },
        {
          id: 'critical-illness-insurance-100k',
          type: 'investment',
          name: 'Critical Illness Insurance ($100K)',
          age: 0,
          year: 0,
          costs: { monthly: 80, duration: 360 }, // 30 years
          icon: '💊',
          color: '#f92672',
          removable: true,
          description: 'Lump sum payout for critical illnesses (cancer, heart attack, stroke)',
        },
        {
          id: 'critical-illness-insurance-200k',
          type: 'investment',
          name: 'Critical Illness Insurance ($200K)',
          age: 0,
          year: 0,
          costs: { monthly: 150, duration: 360 },
          icon: '💊',
          color: '#f92672',
          removable: true,
          description: 'Lump sum payout for critical illnesses',
        },
        {
          id: 'income-protection-insurance',
          type: 'investment',
          name: 'Income Protection Insurance',
          age: 0,
          year: 0,
          costs: { monthly: 100, duration: 360 }, // Until retirement
          icon: '💰',
          color: '#a6e22e',
          removable: true,
          description: 'Monthly payout if unable to work due to disability',
        },
        {
          id: 'early-critical-illness',
          type: 'investment',
          name: 'Early Critical Illness (ECI)',
          age: 0,
          year: 0,
          costs: { monthly: 50, duration: 360 },
          icon: '🩺',
          color: '#fd971f',
          removable: true,
          description: 'Coverage for early-stage critical illnesses',
        },
        {
          id: 'cancer-insurance',
          type: 'investment',
          name: 'Cancer Insurance',
          age: 0,
          year: 0,
          costs: { monthly: 60, duration: 360 },
          icon: '🎗️',
          color: '#ff6b9d',
          removable: true,
          description: 'Specialized cancer coverage with multiple payouts',
        },
        // Savings & Investment Plans
        {
          id: 'endowment-plan-short',
          type: 'investment',
          name: 'Endowment Plan (10-year)',
          age: 0,
          year: 0,
          costs: { monthly: 500, duration: 120 }, // 10 years premium
          income: { oneTime: 70000, startAge: 10 }, // Maturity payout
          icon: '📊',
          color: '#ffeb3b',
          removable: true,
          description: 'Short-term savings plan with guaranteed returns',
        },
        {
          id: 'endowment-plan-long',
          type: 'investment',
          name: 'Endowment Plan (25-year)',
          age: 0,
          year: 0,
          costs: { monthly: 400, duration: 300 }, // 25 years premium
          income: { oneTime: 150000, startAge: 25 }, // Maturity payout
          icon: '📊',
          color: '#ffeb3b',
          removable: true,
          description: 'Long-term savings plan with guaranteed returns',
        },
        {
          id: 'ilp-investment-plan',
          type: 'investment',
          name: 'Investment-Linked Policy (ILP)',
          age: 0,
          year: 0,
          costs: { monthly: 800, duration: 240 }, // 20 years premium
          income: { oneTime: 250000, startAge: 20 }, // Projected returns (not guaranteed)
          icon: '📈',
          color: '#ae81ff',
          removable: true,
          description: 'Insurance + investment with market-linked returns',
        },
        {
          id: 'retirement-income-plan',
          type: 'investment',
          name: 'Retirement Income Plan',
          age: 0,
          year: 0,
          costs: { monthly: 1000, duration: 240 }, // Pay until 55
          income: { monthly: 2000, startAge: 65, endAge: 90 }, // Monthly payout from 65
          icon: '🏖️',
          color: '#66d9ef',
          removable: true,
          description: 'Guaranteed monthly retirement income from age 65',
        },
        {
          id: 'childrens-education-plan',
          type: 'investment',
          name: "Children's Education Plan",
          age: 0,
          year: 0,
          costs: { monthly: 600, duration: 180 }, // 15 years
          income: { oneTime: 150000, startAge: 18 }, // University fund
          icon: '🎓',
          color: '#a6e22e',
          removable: true,
          description: 'Education savings plan with guaranteed payout at age 18',
        },
        {
          id: 'srs-contribution',
          type: 'investment',
          name: 'SRS Annual Contribution',
          age: 0,
          year: 0,
          costs: { yearly: 15300, duration: 30 }, // Max contribution until retirement
          income: { monthly: 1500, startAge: 65, endAge: 75 }, // Withdrawal over 10 years
          icon: '💼',
          color: '#66d9ef',
          removable: true,
          description: 'Supplementary Retirement Scheme - Tax deductible retirement savings',
        },

        // Life Events
        {
          id: 'death',
          type: 'custom',
          name: 'End of Life',
          age: 0,
          year: 0,
          costs: { oneTime: 0 },
          icon: '🕊️',
          color: '#8a8a8a',
          removable: true,
          description: 'Expected end of life - movable to adjust your planning horizon',
        },
      ],

      projections: [],

      setUserProfile: (profile) => {
        const financial: FinancialState = {
          currentAge: profile.age || 30,
          currentYear: new Date().getFullYear(),
          monthlyIncome: profile.monthlyIncome?.basic || 5000,
          annualBonus: (profile.monthlyIncome?.bonus || 0) * 12,
          salaryGrowthRate: 3,
          cpfBalances: {
            ordinary: profile.cpfBalances?.ordinary || 50000,
            special: profile.cpfBalances?.special || 30000,
            medisave: profile.cpfBalances?.medisave || 20000,
            retirement: profile.cpfBalances?.retirement,
          },
          cashSavings: profile.cashAndInvestments?.savingsAccount || 20000,
          investments: profile.cashAndInvestments?.stocks?.singapore || 10000,
          netWorth: profile.netWorth || 130000,
        };

        set({
          userProfile: profile,
          financial,
        });

        // Recalculate projections
        get().calculateProjections();
      },

      updateIncome: (monthlyIncome, annualBonus) =>
        set((state) => ({
          financial: { ...state.financial, monthlyIncome, annualBonus },
        })),

      updateSalaryGrowthRate: (rate) =>
        set((state) => ({
          financial: { ...state.financial, salaryGrowthRate: rate },
        })),

      updateStartingCapital: (capital) =>
        set((state) => {
          const updatedFinancial = {
            ...state.financial,
            cashSavings: capital.cashSavings ?? state.financial.cashSavings,
            investments: capital.investments ?? state.financial.investments,
            cpfBalances: {
              ...state.financial.cpfBalances,
              ordinary: capital.cpfOA ?? state.financial.cpfBalances.ordinary,
              special: capital.cpfSA ?? state.financial.cpfBalances.special,
              medisave: capital.cpfMA ?? state.financial.cpfBalances.medisave,
            },
          };

          // Recalculate net worth
          updatedFinancial.netWorth =
            updatedFinancial.cashSavings +
            updatedFinancial.investments +
            updatedFinancial.cpfBalances.ordinary +
            updatedFinancial.cpfBalances.special +
            updatedFinancial.cpfBalances.medisave;

          return { financial: updatedFinancial };
        }),

      addModule: (module) =>
        set((state) => {
          // Generate unique ID for this instance
          const newModule = {
            ...module,
            id: `${module.id}-${Date.now()}`,
            year: state.financial.currentYear + (module.age - state.financial.currentAge),
          };

          const updatedModules = [...state.timelineModules, newModule];

          // Update active scenario if exists
          const updatedScenarios = state.activeScenarioId
            ? state.scenarios.map(s =>
                s.id === state.activeScenarioId
                  ? { ...s, modules: updatedModules }
                  : s
              )
            : state.scenarios;

          return {
            timelineModules: updatedModules,
            scenarios: updatedScenarios,
          };
        }),

      removeModule: (moduleId) =>
        set((state) => {
          const updatedModules = state.timelineModules.filter((m) => m.id !== moduleId);

          // Update active scenario if exists
          const updatedScenarios = state.activeScenarioId
            ? state.scenarios.map(s =>
                s.id === state.activeScenarioId
                  ? { ...s, modules: updatedModules }
                  : s
              )
            : state.scenarios;

          return {
            timelineModules: updatedModules,
            scenarios: updatedScenarios,
          };
        }),

      updateModule: (moduleId, updates) =>
        set((state) => {
          const updatedModules = state.timelineModules.map((m) =>
            m.id === moduleId ? { ...m, ...updates } : m
          );

          // Update active scenario if exists
          const updatedScenarios = state.activeScenarioId
            ? state.scenarios.map(s =>
                s.id === state.activeScenarioId
                  ? { ...s, modules: updatedModules }
                  : s
              )
            : state.scenarios;

          return {
            timelineModules: updatedModules,
            scenarios: updatedScenarios,
          };
        }),

      moveModule: (moduleId, newAge) =>
        set((state) => ({
          timelineModules: state.timelineModules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  age: newAge,
                  year: state.financial.currentYear + (newAge - state.financial.currentAge),
                }
              : m
          ),
        })),

      calculateProjections: () => {
        const state = get();
        const projections = calculateProjections(
          state.financial.currentAge,
          state.financial,
          state.timelineModules
        );
        set({ projections });
      },

      resetTimeline: () =>
        set((state) => ({
          timelineModules: [],
          projections: calculateProjections(
            state.financial.currentAge,
            state.financial,
            []
          ),
        })),

      loadScenario: (scenario) => set(scenario),

      saveScenario: (name) => {
        const state = get();
        const scenario = {
          name,
          financial: state.financial,
          timelineModules: state.timelineModules,
          savedAt: new Date().toISOString(),
        };

        // Save to localStorage
        const savedScenarios = JSON.parse(
          localStorage.getItem('timelineScenarios') || '[]'
        );
        savedScenarios.push(scenario);
        localStorage.setItem('timelineScenarios', JSON.stringify(savedScenarios));
      },

      // Scenario/Branch Management Methods
      createBranch: (name, description, customColor, branchAge) => {
        const state = get();
        const color = customColor || get().getNextDefaultColor();

        const newScenario: Scenario = {
          id: `scenario-${Date.now()}`,
          name,
          description,
          color,
          branchedFrom: state.activeScenarioId || undefined,
          branchAge: branchAge || state.financial.currentAge,
          createdAt: new Date().toISOString(),
          modules: [...state.timelineModules],
          financial: { ...state.financial },
        };

        set((state) => ({
          scenarios: [...state.scenarios, newScenario],
          activeScenarioId: newScenario.id,
        }));
      },

      switchScenario: (scenarioId) => {
        const state = get();
        const scenario = state.scenarios.find(s => s.id === scenarioId);

        if (scenario) {
          set({
            activeScenarioId: scenarioId,
            timelineModules: [...scenario.modules],
            financial: { ...scenario.financial },
          });
          get().calculateProjections();
        }
      },

      deleteScenario: (scenarioId) => {
        set((state) => {
          const scenarios = state.scenarios.filter(s => s.id !== scenarioId);
          const activeId = state.activeScenarioId === scenarioId
            ? (scenarios[0]?.id || null)
            : state.activeScenarioId;

          return {
            scenarios,
            activeScenarioId: activeId,
          };
        });
      },

      updateScenarioName: (scenarioId, name) => {
        set((state) => ({
          scenarios: state.scenarios.map(s =>
            s.id === scenarioId ? { ...s, name } : s
          ),
        }));
      },

      updateScenarioColor: (scenarioId, color) => {
        set((state) => ({
          scenarios: state.scenarios.map(s =>
            s.id === scenarioId ? { ...s, color } : s
          ),
        }));
      },

      duplicateScenario: (scenarioId, newName) => {
        const state = get();
        const scenario = state.scenarios.find(s => s.id === scenarioId);

        if (scenario) {
          const newScenario: Scenario = {
            ...scenario,
            id: `scenario-${Date.now()}`,
            name: newName,
            branchedFrom: scenarioId,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            scenarios: [...state.scenarios, newScenario],
          }));
        }
      },

      getNextDefaultColor: () => {
        const state = get();
        const usedColors = state.scenarios.map(s => s.color.id);

        // Find first unused color
        const availableColor = SCENARIO_COLORS.find(c => !usedColors.includes(c.id));

        // If all colors used, cycle through
        return availableColor || SCENARIO_COLORS[state.scenarios.length % SCENARIO_COLORS.length];
      },

      getActiveScenario: () => {
        const state = get();
        return state.scenarios.find(s => s.id === state.activeScenarioId) || null;
      },

      // Custom Module Management
      addCustomModule: (module) => {
        const newModule: TimelineModule = {
          ...module,
          id: `custom-${Date.now()}`,
          age: 0,
          year: 0,
          isCustom: true,
          removable: true,
        };

        set((state) => ({
          customModules: [...state.customModules, newModule],
        }));
      },

      deleteCustomModule: (moduleId) => {
        set((state) => ({
          customModules: state.customModules.filter(m => m.id !== moduleId),
        }));
      },

      updateCustomModule: (moduleId, updates) => {
        set((state) => ({
          customModules: state.customModules.map(m =>
            m.id === moduleId ? { ...m, ...updates } : m
          ),
        }));
      },

      // Profile Management Methods
      exportProfile: (profileName, description, tags) => {
        const state = get();

        // Calculate stats from current state
        const lastProjection = state.projections[state.projections.length - 1];
        const stats = {
          retirementAge: 65, // Could be calculated from modules
          finalNetWorth: lastProjection?.netWorth || 0,
          peakCashFlow: Math.max(...state.projections.map(p => p.cashFlow || 0)),
          totalLifeEvents: state.scenarios.reduce((sum, s) => sum + s.modules.length, 0),
        };

        const profile: CompleteProfile = {
          id: `profile-${Date.now()}`,
          name: profileName,
          description,
          author: state.userProfile?.name || 'Anonymous',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: '1.0.0',
          isTemplate: false,
          tags,
          financial: state.financial,
          scenarios: state.scenarios,
          activeScenarioId: state.activeScenarioId,
          customModules: state.customModules,
          stats,
        };

        return profile;
      },

      importProfile: (profile) => {
        set({
          financial: profile.financial,
          scenarios: profile.scenarios,
          activeScenarioId: profile.activeScenarioId,
          customModules: profile.customModules,
        });
        get().calculateProjections();
      },

      downloadProfileJSON: (profile) => {
        const json = JSON.stringify(profile, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}-life-plan.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },

      generateShareCode: (profile) => {
        // Simple base64 encoding (in production, use proper compression + backend storage)
        const json = JSON.stringify(profile);
        const encoded = btoa(encodeURIComponent(json));
        // Generate 6-character code (in production, store in database)
        const shortCode = encoded.substring(0, 6).toUpperCase();
        // Store in localStorage with full data
        localStorage.setItem(`share-${shortCode}`, json);
        return shortCode;
      },

      loadFromShareCode: async (code) => {
        try {
          // Try localStorage first (for testing)
          const stored = localStorage.getItem(`share-${code}`);
          if (stored) {
            return JSON.parse(stored) as CompleteProfile;
          }
          // In production, fetch from backend API
          // const response = await fetch(`/api/profiles/${code}`);
          // return await response.json();
          return null;
        } catch (error) {
          console.error('Failed to load profile:', error);
          return null;
        }
      },

      // Theme Actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'timeline-storage-v2',
      version: 2,
    }
  )
);

export default useTimelineStore;