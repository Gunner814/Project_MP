import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Calculator,
  Clock,
  Building2,
  Car,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/profile', label: 'My Profile', icon: User },
  { path: '/timeline', label: 'Life Timeline', icon: Clock },
  { path: '/calculators/cpf', label: 'CPF Calculator', icon: Calculator },
  { path: '/housing', label: 'HDB/Property', icon: Building2 },
  { path: '/vehicle', label: 'Car & COE', icon: Car },
  { path: '/investments', label: 'Investments', icon: TrendingUp },
];

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="backdrop-blur-md bg-bg-secondary/80 border-b-2 border-accent-primary sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-accent-primary">
              SG Life Planner
            </span>
            <span className="text-text-primary text-2xl">
              🇸🇬
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                    active
                      ? 'text-text-primary border-b-2 border-text-primary bg-bg-hover'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-text-primary p-2 hover:bg-bg-hover rounded-lg transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all font-semibold ${
                    active
                      ? 'text-text-primary bg-bg-hover'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}