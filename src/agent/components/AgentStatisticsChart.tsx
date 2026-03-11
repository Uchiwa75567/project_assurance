import type { FC } from 'react';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { week: '0',   current: 62, previous: 42 },
  { week: '1w',  current: 54, previous: 38 },
  { week: '2w',  current: 50, previous: 37 },
  { week: '3w',  current: 54, previous: 41 },
  { week: '4w',  current: 52, previous: 39 },
  { week: '5w',  current: 60, previous: 48 },
  { week: '6w',  current: 68, previous: 62 },
  { week: '7w',  current: 84, previous: 78 },
  { week: '8w',  current: 92, previous: 84 },
];

const PERIODS = ['Weekly', 'Monthly', 'Yearly'] as const;
type Period = (typeof PERIODS)[number];

const AgentStatisticsChart: FC = () => {
  const [period, setPeriod] = useState<Period>('Weekly');
  const [open, setOpen] = useState(false);

  return (
    <div className="dash-chart-card">
      {/* Legend + dropdown */}
      <div className="dash-chart-card__header">
        <div className="dash-chart-card__legend">
          <span className="dash-chart-card__legend-item">
            <img
              src="/agent/icon-chart-line.svg"
              alt=""
              className="dash-chart-card__legend-icon"
            />
            <span className="dash-chart-card__legend-label">Client</span>
          </span>
        </div>

        <div className="dash-chart-card__dropdown-wrap">
          <button
            className="dash-chart-card__dropdown-btn"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{period}</span>
            <img
              src="/agent/icon-collapse-arrow.png"
              alt="toggle"
              className="dash-chart-card__dropdown-arrow"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
            />
          </button>
          {open && (
            <ul className="dash-chart-card__dropdown-menu">
              {PERIODS.map((p) => (
                <li
                  key={p}
                  className={`dash-chart-card__dropdown-option${
                    p === period ? ' dash-chart-card__dropdown-option--active' : ''
                  }`}
                  onClick={() => {
                    setPeriod(p);
                    setOpen(false);
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="dash-chart-card__chart">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="agentColorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#287d00" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#287d00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="agentColorPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ff0b0b" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#ff0b0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={true} horizontal={false} stroke="#e8e8e8" />

            <XAxis
              dataKey="week"
              tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fill: '#040f26', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              domain={[30, 90]}
              ticks={[40, 60, 80]}
              tickFormatter={(v) => `${v}k`}
              tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fill: '#9f9f9f', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip
              contentStyle={{
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 13,
                borderRadius: 10,
                border: '1px solid #e8e8e8',
              }}
              formatter={(value) => [`${value ?? 0}k`]}
            />

            {/* Current period – solid green */}
            <Area
              type="monotone"
              dataKey="current"
              stroke="#287d00"
              strokeWidth={2.5}
              fill="url(#agentColorCurrent)"
              dot={false}
              activeDot={{ r: 4, fill: '#287d00' }}
            />

            {/* Previous period – dashed red */}
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#ff0b0b"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#agentColorPrev)"
              dot={false}
              activeDot={{ r: 4, fill: '#ff0b0b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgentStatisticsChart;
