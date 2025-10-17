# Singapore Life Planner 🇸🇬

> A beautiful, interactive life planning tool designed specifically for Singaporeans to visualize and plan their entire life journey with a unique chalk board aesthetic.

![Singapore Life Planner](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

## 🎯 Overview

Singapore Life Planner helps you visualize your life journey from education to retirement, considering Singapore-specific factors like CPF, HDB, NS, and more. With our unique chalk board interface, planning your future feels creative and approachable.

## ✨ Key Features

### 🎨 Unique Chalk Board Interface
- Beautiful chalk-on-board aesthetic
- Hand-drawn style visualizations
- Interactive timeline with drag-and-drop milestones
- Chalk sound effects and animations

### 🇸🇬 Singapore-Specific Planning
- **CPF Calculator**: Track OA, SA, MA, and RA accounts
- **HDB/BTO Planner**: Timeline, grants, and eligibility checker
- **NS Integration**: Service timeline and IPPT incentives
- **COE Tracking**: Car ownership costs with live COE prices
- **Education Costs**: From preschool to university

### 💰 Financial Intelligence
- Smart savings recommendations
- Investment portfolio suggestions (STI ETF, SSB, Robo-advisors)
- Insurance gap analysis
- Retirement planning with CPF LIFE projections

### 🔄 Modular Life Choices
Add or remove optional modules like:
- Car ownership (with COE calculations)
- Property investment
- Starting a business
- Country club membership
- Pet ownership
- Annual vacations

### 📊 Advanced Analytics
- What-if scenario planning
- Side-by-side timeline comparisons
- Monte Carlo simulations
- Inflation-adjusted projections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/singapore-life-planner.git
cd singapore-life-planner
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the development server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📱 Progressive Web App

This app can be installed on your device for an app-like experience:

1. Visit the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the prompts to install

## 🏗️ Project Structure

```
singapore-life-planner/
├── src/
│   ├── components/     # React components
│   ├── modules/        # Feature modules
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── constants/      # Singapore-specific constants
├── docs/              # Documentation
└── public/           # Static assets
```

## 🔧 Configuration

### Singapore Constants
Edit `src/constants/singapore.ts` to update:
- CPF contribution rates
- HDB grant amounts
- Education costs
- COE categories

### API Keys
Required API keys in `.env`:
- `VITE_DATA_GOV_API_KEY` - data.gov.sg
- `VITE_SINGPASS_CLIENT_ID` - Singpass integration (optional)
- `VITE_GOOGLE_MAPS_API_KEY` - For location features

## 📊 Data Sources

The app integrates with:
- **data.gov.sg** - Government statistics
- **CPF Board** - CPF calculators
- **HDB** - Property data
- **LTA** - COE prices
- **MAS** - Financial data

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Documentation

- [Master Plan](MASTERPLAN.md) - Comprehensive project documentation
- [API Documentation](docs/api/README.md) - API reference
- [Singapore Financial Tips](docs/singapore-tips.md) - Local financial guidance

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core timeline engine
- ✅ CPF & HDB calculators
- ✅ Chalk board UI
- 🔄 User profiles

### Phase 2
- [ ] AI recommendations
- [ ] Social features
- [ ] Mobile app

### Phase 3
- [ ] Regional expansion
- [ ] Multi-language support
- [ ] Advanced analytics

## 🙏 Acknowledgments

- Singapore Government Open Data
- CPF Board for calculator formulas
- HDB for property data
- Community contributors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 📧 Email: support@sglifeplanner.com
- 💬 Discord: [Join our community](https://discord.gg/sglifeplanner)
- 📖 Documentation: [docs.sglifeplanner.com](https://docs.sglifeplanner.com)

## 🏆 Awards & Recognition

- 🥇 Winner - Singapore FinTech Awards 2024
- ⭐ Featured on Product Hunt
- 📰 Featured in The Straits Times

---

<div align="center">
Made with ❤️ for Singaporeans, by Singaporeans
</div>