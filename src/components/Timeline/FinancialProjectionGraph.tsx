import { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, PiggyBank } from 'lucide-react';
import useTimelineStore from '@/stores/timelineStore';

export default function FinancialProjectionGraph() {
  const { projections, financial } = useTimelineStore();

  const chartData = useMemo(() => {
    return projections.map(p => ({
      age: p.age,
      year: p.year,
      netWorth: Math.round(p.netWorth / 1000), // Convert to thousands
      cashFlow: Math.round(p.cashFlow),
      cpfTotal: Math.round(p.cpfTotal / 1000),
      cpfOA: Math.round((p.cpfOA || 0) / 1000),
      cpfSA: Math.round((p.cpfSA || 0) / 1000),
      cpfMA: Math.round((p.cpfMA || 0) / 1000),
      cashSavings: Math.round((p.cashSavings || 0) / 1000),
      liquidAssets: Math.round((p.netWorth - p.cpfTotal) / 1000),
    }));
  }, [projections]);

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'cashFlow') {
      return `$${value.toLocaleString()}/mo`;
    }
    return `$${value.toLocaleString()}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-bg-secondary/95 p-3 rounded-lg border-2 border-accent-primary shadow-2xl">
          <p className="font-bold text-text-primary mb-2">Age {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {formatTooltipValue(entry.value, entry.dataKey)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const milestones = [
    { age: 55, label: 'CPF Withdrawal', color: '#ffeb3b' },
    { age: 62, label: 'Retirement', color: '#a6e22e' },
    { age: 65, label: 'CPF Life', color: '#66d9ef' },
  ];

  // Calculate key metrics
  const currentNetWorth = chartData.find(d => d.age === financial.currentAge)?.netWorth || 0;
  const retirementNetWorth = chartData.find(d => d.age === 62)?.netWorth || 0;
  const peakNetWorth = Math.max(...chartData.map(d => d.netWorth));
  const financialIndependenceAge = chartData.find(d => d.netWorth >= 1000)?.age; // $1M

  const formatNetWorth = (value: number) => {
    if (value >= 1000) {
      const millions = (value / 1000).toFixed(1);
      return `$${parseFloat(millions).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    }
    return `$${value.toLocaleString('en-US')}k`;
  };

  return (
    <div className="bg-bg-secondary p-4 rounded-lg border-2 border-border-primary">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl text-text-primary font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-success" />
          Financial Projections
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Your wealth trajectory based on current plan
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-bg-tertiary p-3 rounded-lg border-2 border-border-primary">
          <div className="text-xs text-text-muted mb-1">Current Net Worth</div>
          <div className="text-base font-bold text-money-positive break-words">{formatNetWorth(currentNetWorth)}</div>
        </div>

        <div className="bg-bg-tertiary p-3 rounded-lg border-2 border-border-primary">
          <div className="text-xs text-text-muted mb-1">At Retirement (62)</div>
          <div className="text-base font-bold text-accent-info break-words">{formatNetWorth(retirementNetWorth)}</div>
        </div>

        <div className="bg-bg-tertiary p-3 rounded-lg border-2 border-border-primary">
          <div className="text-xs text-text-muted mb-1">Peak Net Worth</div>
          <div className="text-base font-bold text-accent-warning break-words">{formatNetWorth(peakNetWorth)}</div>
        </div>

        <div className="bg-bg-tertiary p-3 rounded-lg border-2 border-border-primary">
          <div className="text-xs text-text-muted mb-1">FI Age ($1M)</div>
          <div className="text-base font-bold text-money-positive">
            {financialIndependenceAge || 'N/A'}
          </div>
        </div>
      </div>

      {/* Net Worth Chart */}
      <div className="mb-6">
        <h4 className="text-sm text-text-primary font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-money-positive" />
          Net Worth Over Time
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a6e22e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a6e22e" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="cpfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66d9ef" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#66d9ef" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#75715e" opacity={0.3} />
            <XAxis
              dataKey="age"
              stroke="#f8f8f2"
              tick={{ fill: '#f8f8f2', fontSize: 12 }}
              label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#f8f8f2' }}
            />
            <YAxis
              stroke="#f8f8f2"
              tick={{ fill: '#f8f8f2', fontSize: 12 }}
              label={{ value: 'Net Worth ($k)', angle: -90, position: 'insideLeft', fill: '#f8f8f2' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="rect"
            />

            {/* Milestone lines */}
            {milestones.map(m => (
              <line
                key={m.age}
                x1={m.age}
                y1="0%"
                x2={m.age}
                y2="100%"
                stroke={m.color}
                strokeDasharray="5 5"
                opacity={0.5}
              />
            ))}

            <Area
              type="monotone"
              dataKey="netWorth"
              name="Total Net Worth"
              stroke="#a6e22e"
              fillOpacity={1}
              fill="url(#netWorthGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cpfTotal"
              name="CPF Balance"
              stroke="#66d9ef"
              fillOpacity={1}
              fill="url(#cpfGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cash Flow Chart */}
      <div>
        <h4 className="text-sm text-text-primary font-semibold mb-3 flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-accent-info" />
          Monthly Cash Flow
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#75715e" opacity={0.3} />
            <XAxis
              dataKey="age"
              stroke="#f8f8f2"
              tick={{ fill: '#f8f8f2', fontSize: 12 }}
            />
            <YAxis
              stroke="#f8f8f2"
              tick={{ fill: '#f8f8f2', fontSize: 12 }}
              label={{ value: 'Cash Flow ($/mo)', angle: -90, position: 'insideLeft', fill: '#f8f8f2' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Zero line */}
            <line y1={0} y2={0} stroke="#ff6b9d" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="cashFlow"
              name="Monthly Cash Flow"
              stroke="#f92672"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for milestones */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-casual">
        {milestones.map(m => (
          <div key={m.age} className="flex items-center gap-1">
            <div
              className="w-3 h-0.5"
              style={{ backgroundColor: m.color, borderStyle: 'dashed' }}
            />
            <span className="text-chalk-white opacity-70">{m.label} ({m.age})</span>
          </div>
        ))}
      </div>
    </div>
  );
}