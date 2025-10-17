# Singapore Life Planner - Master Plan 🇸🇬

## 📋 Executive Summary

The Singapore Life Planner is a comprehensive Progressive Web Application (PWA) designed to help Singaporeans visualize and plan their entire life journey from birth to retirement. With a unique chalk board aesthetic and deep integration with Singapore-specific financial systems, this tool provides personalized life roadmaps considering CPF, HDB, NS, and other local factors.

## 🎯 Vision & Goals

### Primary Vision
Create an intuitive, visually engaging life planning tool that makes complex financial and life decisions accessible to all Singaporeans.

### Core Goals
1. **Personalized Life Visualization** - Interactive timeline showing major life milestones
2. **Financial Intelligence** - Smart calculations considering CPF, taxes, and Singapore-specific costs
3. **Scenario Planning** - "What-if" analysis for different life choices
4. **Educational Resource** - Built-in guides for Singapore financial literacy
5. **Beautiful UX** - Chalk board aesthetic making planning feel creative and approachable

## 🏗️ Technology Architecture

### Frontend Stack
```
React 18+ with TypeScript
├── Tailwind CSS (styling)
├── Framer Motion (animations)
├── D3.js (data visualization)
├── Canvas API (chalk effects)
├── React Query (data fetching)
├── Zustand (state management)
└── React Hook Form (form handling)
```

### Backend Stack
```
Node.js with Express
├── PostgreSQL (primary database)
├── Redis (caching layer)
├── JWT (authentication)
├── Axios (external API calls)
└── Node-cron (scheduled tasks)
```

### Infrastructure
```
Deployment
├── Frontend: Vercel
├── Backend: Railway
├── Database: Supabase
├── CDN: Cloudflare
└── Monitoring: Sentry
```

## 📁 Project Structure

```
singapore-life-planner/
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── service-worker.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChalkBoard/
│   │   │   │   ├── ChalkCanvas.tsx
│   │   │   │   ├── ChalkText.tsx
│   │   │   │   └── ChalkEffects.ts
│   │   │   ├── Timeline/
│   │   │   │   ├── LifeTimeline.tsx
│   │   │   │   ├── Milestone.tsx
│   │   │   │   └── TimelineControls.tsx
│   │   │   ├── Calculators/
│   │   │   │   ├── CPFCalculator.tsx
│   │   │   │   ├── HDBCalculator.tsx
│   │   │   │   ├── RetirementCalculator.tsx
│   │   │   │   └── InsuranceCalculator.tsx
│   │   │   └── Wizards/
│   │   │       ├── OnboardingWizard.tsx
│   │   │       └── MilestoneWizard.tsx
│   │   ├── modules/
│   │   │   ├── personal/
│   │   │   ├── career/
│   │   │   ├── housing/
│   │   │   ├── family/
│   │   │   ├── insurance/
│   │   │   ├── investments/
│   │   │   └── retirement/
│   │   ├── services/
│   │   │   ├── api/
│   │   │   ├── singapore-data/
│   │   │   └── market-data/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── constants/
│   │       └── singapore.ts
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── docs/
│   ├── api/
│   ├── guides/
│   └── singapore-specific/
└── shared/
    └── types/
```

## 🎨 Design System

### Chalk Board Aesthetic
- **Background**: Dark green board texture (#1a3d2e)
- **Chalk Colors**: White (#ffffff), Yellow (#ffeb3b), Pink (#ff6b9d)
- **Fonts**: Kalam (handwritten), Caveat (casual)
- **Effects**: Chalk dust particles, smudge animations, eraser trails
- **Sounds**: Chalk writing, erasing, tapping

### UI Components
```typescript
// Chalk Text Component
interface ChalkTextProps {
  text: string;
  color?: 'white' | 'yellow' | 'pink';
  size?: 'small' | 'medium' | 'large';
  effect?: 'normal' | 'bold' | 'dotted';
}

// Timeline Milestone
interface MilestoneProps {
  age: number;
  title: string;
  type: 'education' | 'career' | 'family' | 'housing' | 'financial';
  status: 'completed' | 'current' | 'planned' | 'optional';
}
```

## 🇸🇬 Singapore-Specific Features

### 1. CPF Integration
```typescript
interface CPFAccount {
  ordinary: number;      // OA - Housing, education, investment
  special: number;       // SA - Retirement
  medisave: number;      // MA - Healthcare
  retirement: number;    // RA - Created at 55
}

// Contribution rates by age
const CPF_RATES = {
  '<=35': { employee: 20, employer: 17 },
  '36-45': { employee: 20, employer: 17 },
  '46-50': { employee: 20, employer: 17 },
  '51-55': { employee: 19, employer: 16 },
  '56-60': { employee: 15, employer: 13 },
  '61-65': { employee: 9.5, employer: 9 },
  '>65': { employee: 7, employer: 7.5 }
};
```

### 2. HDB/BTO System
```typescript
interface HDBPlanning {
  btoApplication: {
    firstTimer: boolean;
    singles: boolean;  // 35+ years old
    familyNucleus: 'married' | 'fiancé' | 'single' | 'orphan';
  };
  grants: {
    enhancedHousingGrant: number;  // Up to $80k
    proximityGrant: number;         // Up to $30k
    singlesSingaporeGrant: number;  // Up to $15k
  };
  timeline: {
    applicationDate: Date;
    ballotingDate: Date;
    selectionDate: Date;
    keyCollectionDate: Date;  // 3-4 years later
  };
}
```

### 3. National Service Module
```typescript
interface NSModule {
  enlistmentDate: Date;
  ordDate: Date;  // 2 years later
  reservist: {
    cycles: number;  // 10 cycles
    completionAge: 40 | 50;  // Based on rank
  };
  ippt: {
    goldIncentive: 500;
    silverIncentive: 300;
    passIncentive: 200;
  };
}
```

### 4. Education Costs
```typescript
const EDUCATION_COSTS = {
  preschool: { monthly: [200, 2000] },  // Range
  primary: { annual: [200, 500] },      // Miscellaneous
  secondary: { annual: [400, 800] },
  jc: { annual: [500, 1000] },
  polytechnic: { annual: [2900, 3500] },
  university: {
    nus_ntu_smu: { annual: [8200, 12000] },
    sit_suss: { annual: [7500, 11000] },
    sutd: { annual: [13200, 13500] }
  }
};
```

### 5. Modular Life Choices System
```typescript
// Users can add/remove optional life modules
interface LifeModule {
  id: string;
  name: string;
  category: 'lifestyle' | 'luxury' | 'investment' | 'family';
  enabled: boolean;
  impact: FinancialImpact;
  requirements?: Requirement[];
}

// Car Ownership Module
interface CarModule extends LifeModule {
  carType: 'sedan' | 'suv' | 'hybrid' | 'electric';
  purchaseAge: number;
  replacementCycle: number;  // Years before changing car

  costs: {
    // COE (Certificate of Entitlement)
    coe: {
      category: 'A' | 'B' | 'E';  // A: <=1600cc, B: >1600cc, E: Open
      currentPrice: number;  // Live data from LTA
      historicalAverage: number;
      validityPeriod: 10;  // years
    };

    // Vehicle costs
    vehiclePrice: number;
    arf: number;  // Additional Registration Fee
    roadTax: number;  // Annual
    insurance: number;  // Annual

    // Running costs
    petrol: number;  // Monthly estimate
    parking: {
      home: number;  // Monthly
      office: number;  // Monthly
      public: number;  // Monthly estimate
    };
    maintenance: number;  // Annual
    erp: number;  // Monthly estimate
  };
}

// Other Optional Modules
const LIFE_MODULES = {
  // Transportation
  car: {
    name: 'Car Ownership',
    monthlyImpact: [1500, 3000],  // Range based on car type
    oneTimeCost: [80000, 200000],  // Including COE
  },
  motorcycle: {
    name: 'Motorcycle',
    monthlyImpact: [300, 600],
    oneTimeCost: [15000, 30000],
  },

  // Lifestyle
  countryClub: {
    name: 'Country Club Membership',
    monthlyImpact: [200, 500],
    oneTimeCost: [10000, 100000],  // Entrance fee
  },
  maid: {
    name: 'Domestic Helper',
    monthlyImpact: [1200, 1800],  // Salary + levy + expenses
    requirements: ['housing_type:private|hdb_4room+'],
  },

  // Pets
  pet_dog: {
    name: 'Dog Ownership',
    monthlyImpact: [200, 500],
    oneTimeCost: [500, 5000],
    duration: 12,  // years average lifespan
  },
  pet_cat: {
    name: 'Cat Ownership',
    monthlyImpact: [150, 300],
    oneTimeCost: [300, 2000],
    duration: 15,
  },

  // Travel
  annual_vacation: {
    name: 'Annual Overseas Vacation',
    yearlyImpact: [3000, 15000],
    frequency: 'yearly',
  },

  // Hobbies
  golf: {
    name: 'Golf Hobby',
    monthlyImpact: [300, 1000],
    oneTimeCost: [2000, 5000],  // Equipment
  },

  // Investment Properties
  rental_property: {
    name: 'Investment Property',
    monthlyIncome: [2000, 5000],  // Rental income
    monthlyExpense: [1500, 4000],  // Mortgage + maintenance
    oneTimeCost: [300000, 1500000],  // Down payment
    requirements: ['existing_property', 'absd_payable'],
  },

  // Business
  startup: {
    name: 'Start a Business',
    monthlyImpact: [-5000, 10000],  // Can be negative (loss) or positive
    oneTimeCost: [10000, 100000],
    riskLevel: 'high',
  },

  // Family Extensions
  elderly_care: {
    name: 'Elderly Parent Care',
    monthlyImpact: [500, 3000],
    variants: ['home_care', 'nursing_home', 'day_care'],
  },

  // Education Enhancement
  private_tuition: {
    name: 'Private Tuition for Children',
    monthlyImpact: [500, 2000],  // Per child
    requirements: ['has_children'],
  },
  enrichment_classes: {
    name: 'Enrichment Classes',
    monthlyImpact: [300, 1500],  // Music, sports, arts
    requirements: ['has_children'],
  },
};

// Module Impact Calculator
function calculateModuleImpact(
  module: LifeModule,
  userProfile: UserProfile,
  startAge: number,
  endAge: number
): FinancialProjection {
  const years = endAge - startAge;
  const inflation = 0.023;  // Singapore average

  let totalCost = module.costs.oneTime;

  // Add recurring costs with inflation
  for (let year = 0; year < years; year++) {
    const inflationMultiplier = Math.pow(1 + inflation, year);

    // Monthly costs
    totalCost += module.costs.monthly * 12 * inflationMultiplier;

    // Special calculations for cars (COE renewal every 10 years)
    if (module.type === 'car' && year % 10 === 0 && year > 0) {
      totalCost += module.costs.coe.currentPrice * inflationMultiplier;
    }
  }

  return {
    totalCost,
    monthlyAverage: totalCost / (years * 12),
    breakdownByYear: calculateYearlyBreakdown(module, years, inflation)
  };
}

// Module Compatibility Checker
function checkModuleCompatibility(
  modules: LifeModule[],
  userProfile: UserProfile
): CompatibilityResult {
  const issues = [];

  // Check financial feasibility
  const totalMonthlyImpact = modules.reduce((sum, m) => sum + m.monthlyImpact, 0);
  if (totalMonthlyImpact > userProfile.income * 0.7) {
    issues.push('Total monthly costs exceed 70% of income');
  }

  // Check module conflicts
  if (modules.includes('hdb_bto') && modules.includes('private_condo')) {
    issues.push('Cannot own HDB and private property simultaneously without ABSD');
  }

  return {
    compatible: issues.length === 0,
    issues,
    recommendations: generateRecommendations(modules, userProfile)
  };
}
```

## 📊 Core Modules

### 1. User Financial Profile System
- **Comprehensive Data Input**: Current CPF balances, cash holdings, investments
- **Asset Tracking**: Properties, vehicles, insurance policies
- **Liability Management**: Mortgages, loans, credit cards
- **Income Sources**: Employment, rental, dividends, business
- **Expense Tracking**: Fixed and variable monthly expenses
- **Net Worth Calculator**: Real-time calculation of total assets vs liabilities
- **Financial Health Metrics**: TDSR, savings rate, liquidity ratios

### 2. Timeline Engine
- Interactive drag-and-drop milestones
- Age-based progression visualization
- Parallel timeline comparisons
- Milestone dependencies and prerequisites
- Integration with current financial status

### 3. Financial Calculator Suite
- **CPF Projections**: Based on actual current balances
- **Housing Affordability**: Using real income and debt data
- **Retirement Planning**: Projections from current savings
- **Insurance Coverage**: Gap analysis with existing policies
- **Investment Returns**: Portfolio performance tracking

### 4. Scenario Planning
- What-if analysis starting from current position
- Side-by-side comparison views
- Monte Carlo simulations for uncertainty
- Stress testing for economic downturns

### 4. Data Integration
```typescript
// External APIs to integrate
const DATA_SOURCES = {
  government: [
    'data.gov.sg',           // General statistics
    'singstat.gov.sg',       // Demographics
    'cpf.gov.sg',           // CPF calculators
    'hdb.gov.sg',           // Housing data
    'iras.gov.sg'           // Tax information
  ],
  financial: [
    'mas.gov.sg',           // Monetary authority
    'sgx.com',              // Stock exchange
    'abs.org.sg'            // Banking data
  ],
  market: [
    'propertyguru.com.sg',  // Property prices
    'sgcarmart.com'         // COE prices
  ]
};
```

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project setup and configuration
- [ ] Chalk board UI implementation
- [ ] Basic user profile system
- [ ] Timeline visualization engine

### Phase 2: Core Features (Weeks 3-4)
- [ ] CPF calculation engine
- [ ] HDB/BTO planning module
- [ ] Career progression tracker
- [ ] Basic financial calculators

### Phase 3: Singapore Modules (Weeks 5-6)
- [ ] NS integration for males
- [ ] Education planning system
- [ ] Insurance recommendations
- [ ] Marriage and family planning

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Investment portfolio builder
- [ ] Retirement planning suite
- [ ] Business startup module
- [ ] Market data integration

### Phase 5: Intelligence (Weeks 9-10)
- [ ] Recommendation engine
- [ ] Peer comparison (anonymous)
- [ ] Goal tracking system
- [ ] Alert and notification system

### Phase 6: Polish & Launch (Weeks 11-12)
- [ ] Performance optimization
- [ ] PWA features (offline, install)
- [ ] User testing and feedback
- [ ] Documentation and guides

## 📈 Key Algorithms

### 1. Life Expectancy Adjustment
```typescript
function calculateLifeExpectancy(gender: 'male' | 'female', healthConditions: string[]): number {
  const baseExpectancy = gender === 'male' ? 81.5 : 86.1;  // Singapore 2023
  const healthAdjustments = calculateHealthImpact(healthConditions);
  return Math.max(65, baseExpectancy + healthAdjustments);
}
```

### 2. Savings Rate Optimization
```typescript
function optimizeSavingsRate(income: number, expenses: number, goals: Goal[]): number {
  const minSavings = 0.20;  // 20% minimum
  const maxSavings = 0.70;  // 70% maximum
  const necessaryExpenses = calculateNecessities(expenses);
  const goalRequirements = calculateGoalNeeds(goals);
  return Math.min(maxSavings, Math.max(minSavings, goalRequirements / income));
}
```

### 3. Inflation Adjustment
```typescript
function adjustForInflation(amount: number, years: number, rate: number = 0.023): number {
  // Singapore's average inflation rate: 2.3%
  return amount * Math.pow(1 + rate, years);
}
```

## 🔐 Security & Privacy

### Data Protection
- End-to-end encryption for sensitive data
- PDPA compliance (Singapore Personal Data Protection Act)
- Local storage option for privacy-conscious users
- Anonymous mode for exploration

### Authentication
- Multi-factor authentication
- Biometric login support
- Session management
- Password recovery system

## 📱 Progressive Web App Features

### Offline Capabilities
- Service worker for offline access
- Local data caching
- Sync when online
- Queue operations

### Installation
- Add to home screen
- Desktop shortcuts
- App-like experience
- Push notifications

## 🧪 Testing Strategy

### Unit Tests
- Calculator functions
- Data transformations
- Validation logic
- API integrations

### Integration Tests
- Module interactions
- Database operations
- External API calls
- State management

### E2E Tests
- User journeys
- Critical paths
- Performance benchmarks
- Accessibility compliance

## 📚 Documentation

### User Guides
- Getting started tutorial
- Feature walkthroughs
- Video demonstrations
- FAQ section

### Developer Documentation
- API documentation
- Component library
- Contribution guidelines
- Deployment guide

### Singapore Financial Guides
- CPF explained
- HDB buying process
- Insurance basics
- Investment options
- Retirement planning

## 🎯 Success Metrics

### User Engagement
- Daily active users
- Session duration
- Feature utilization
- Milestone completion

### Financial Impact
- Savings rate improvements
- Goal achievement rates
- Insurance coverage adequacy
- Retirement readiness score

### Technical Performance
- Page load times < 3s
- API response times < 500ms
- 99.9% uptime
- Mobile responsiveness

## 🚦 Launch Strategy

### Beta Testing
1. Internal testing (Week 10)
2. Friends and family (Week 11)
3. Public beta (Week 12)
4. Official launch (Week 13)

### Marketing Channels
- Social media campaign
- Personal finance blogs
- University partnerships
- Government agency collaboration

## 🔄 Future Enhancements

### Version 2.0
- AI financial advisor
- Voice commands
- AR visualization
- Blockchain integration

### Version 3.0
- Regional expansion (ASEAN)
- Multi-currency support
- Immigration planning
- Estate planning

## 📞 Support & Maintenance

### User Support
- In-app chat support
- Email ticketing system
- Community forum
- Knowledge base

### Technical Maintenance
- Weekly updates
- Security patches
- Performance monitoring
- Backup strategies

## 💡 Innovation Opportunities

### AI Integration
- Personalized recommendations
- Predictive analytics
- Natural language queries
- Automated planning

### Gamification
- Achievement badges
- Progress streaks
- Community challenges
- Leaderboards (optional)

### Social Features
- Family planning together
- Couple's joint planning
- Anonymous comparisons
- Success stories sharing

## 📋 Compliance & Legal

### Regulatory Requirements
- MAS guidelines
- PDPA compliance
- Financial advisory regulations
- Data residency requirements

### Terms of Service
- User agreements
- Privacy policy
- Disclaimer notices
- Cookie policy

## 🎓 Educational Content

### Financial Literacy
- Basic budgeting
- Compound interest
- Risk management
- Investment principles

### Singapore Specific
- CPF optimization strategies
- HDB vs private property
- Insurance types explained
- Tax planning basics

## 🏁 Conclusion

The Singapore Life Planner represents a comprehensive solution for Singaporeans to visualize, plan, and optimize their life journey. By combining beautiful design with powerful financial planning tools and deep local knowledge, this application will empower users to make informed decisions about their future.

---

**Last Updated**: October 2024
**Version**: 1.0.0
**Status**: Planning Phase