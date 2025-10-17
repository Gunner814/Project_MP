import { Link } from 'react-router-dom';
import {
  Calculator,
  Home,
  Car,
  TrendingUp,
  Heart,
  DollarSign,
  Clock,
  Target,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  // This would come from localStorage or API
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const hasProfile = Object.keys(userProfile).length > 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-chalk text-chalk-yellow mb-2">
            Welcome to Your Life Journey
          </h1>
          <p className="text-xl font-casual text-chalk-white">
            Plan, visualize, and achieve your Singapore dreams
          </p>
        </div>

        {/* Profile Alert */}
        {!hasProfile && (
          <div className="chalk-card bg-board-light mb-8 border-chalk-yellow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-chalk text-chalk-yellow mb-2">
                  Start Your Journey
                </h3>
                <p className="font-casual text-chalk-white">
                  Create your financial profile to get personalized recommendations
                </p>
              </div>
              <Link
                to="/profile"
                className="chalk-button flex items-center gap-2"
              >
                Create Profile
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {hasProfile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="chalk-card">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="text-chalk-green w-6 h-6" />
                <span className="text-sm font-casual text-chalk-white">Net Worth</span>
              </div>
              <p className="text-2xl font-chalk text-chalk-yellow">
                ${userProfile.netWorth?.toLocaleString() || '0'}
              </p>
            </div>

            <div className="chalk-card">
              <div className="flex items-center justify-between mb-2">
                <Calculator className="text-chalk-blue w-6 h-6" />
                <span className="text-sm font-casual text-chalk-white">CPF Total</span>
              </div>
              <p className="text-2xl font-chalk text-chalk-yellow">
                ${userProfile.cpfTotal?.toLocaleString() || '0'}
              </p>
            </div>

            <div className="chalk-card">
              <div className="flex items-center justify-between mb-2">
                <Target className="text-chalk-pink w-6 h-6" />
                <span className="text-sm font-casual text-chalk-white">Savings Rate</span>
              </div>
              <p className="text-2xl font-chalk text-chalk-yellow">
                {userProfile.savingsRate || '0'}%
              </p>
            </div>

            <div className="chalk-card">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-chalk-white w-6 h-6" />
                <span className="text-sm font-casual text-chalk-white">Retire At</span>
              </div>
              <p className="text-2xl font-chalk text-chalk-yellow">
                {userProfile.retirementAge || '65'}
              </p>
            </div>
          </div>
        )}

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Life Timeline - NEW INTERACTIVE FEATURE */}
          <Link to="/timeline" className="chalk-card hover:bg-board-light transition-all group ring-2 ring-chalk-yellow relative">
            <div className="absolute -top-2 -right-2 bg-chalk-red text-board px-2 py-1 rounded text-xs font-chalk z-10">
              NEW!
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-chalk-yellow rounded-lg">
                <Clock className="w-8 h-8 text-board" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-chalk text-chalk-yellow mb-2">
                  Interactive Timeline
                </h3>
                <p className="font-casual text-chalk-white mb-3">
                  Drag & drop life events, adjust income, see instant projections!
                </p>
                <span className="font-casual text-chalk-blue flex items-center">
                  Start Planning
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* CPF Calculator */}
          <Link to="/calculators/cpf" className="chalk-card hover:bg-board-light transition-all group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-chalk-green rounded-lg">
                <Calculator className="w-8 h-8 text-board" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-chalk text-chalk-green mb-2">
                  CPF Calculator
                </h3>
                <p className="font-casual text-chalk-white mb-3">
                  Optimize your CPF for retirement and housing
                </p>
                <span className="font-casual text-chalk-blue flex items-center">
                  Calculate Now
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* HDB Planner */}
          <Link to="/housing" className="chalk-card hover:bg-board-light transition-all group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-chalk-pink rounded-lg">
                <Home className="w-8 h-8 text-board" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-chalk text-chalk-pink mb-2">
                  HDB/Property
                </h3>
                <p className="font-casual text-chalk-white mb-3">
                  BTO timeline, grants, and affordability check
                </p>
                <span className="font-casual text-chalk-blue flex items-center">
                  Plan Housing
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Vehicle Planning */}
          <Link to="/vehicle" className="chalk-card hover:bg-board-light transition-all group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-chalk-blue rounded-lg">
                <Car className="w-8 h-8 text-board" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-chalk text-chalk-blue mb-2">
                  Car & COE
                </h3>
                <p className="font-casual text-chalk-white mb-3">
                  Calculate true cost of car ownership with COE
                </p>
                <span className="font-casual text-chalk-blue flex items-center">
                  Check Costs
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Investment Tracker */}
          <Link to="/investments" className="chalk-card hover:bg-board-light transition-all group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-chalk-white rounded-lg">
                <TrendingUp className="w-8 h-8 text-board" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-chalk text-chalk-white mb-2">
                  Investments
                </h3>
                <p className="font-casual text-chalk-white mb-3">
                  STI ETF, SSB, and portfolio planning
                </p>
                <span className="font-casual text-chalk-blue flex items-center">
                  Manage Portfolio
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Family Planning */}
          <Link to="/family" className="chalk-card hover:bg-board-light transition-all group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-chalk-red rounded-lg">
                <Heart className="w-8 h-8 text-board" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-chalk text-chalk-red mb-2">
                  Family & Education
                </h3>
                <p className="font-casual text-chalk-white mb-3">
                  Children costs, education savings plan
                </p>
                <span className="font-casual text-chalk-blue flex items-center">
                  Plan Family
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 border-2 border-chalk-yellow border-dashed rounded-lg">
          <h2 className="text-2xl font-chalk text-chalk-yellow mb-4">
            Quick Tips for Singaporeans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-chalk-white font-casual">
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>Top up CPF SA to get $8,000 tax relief</span>
            </div>
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>BTO first, upgrade later for best value</span>
            </div>
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>Aim for 20% minimum savings rate</span>
            </div>
            <div className="flex items-start">
              <span className="text-chalk-green mr-2">✓</span>
              <span>Use SRS for tax deferral if high income</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}