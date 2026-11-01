import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useData } from "@/lib/DataContext";
import { StatCard } from "@/components/UI";
import { formatNumber } from "@/lib/utils";
import { BarChart3, Calendar, Download, TrendingUp } from "lucide-react";

function build30DaySeries(analytics: Array<{ date: string; downloads: number }>) {
  const map = new Map(analytics.map((a) => [a.date, a.downloads]));
  const out: Array<{ date: string; label: string; downloads: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({
      date: key,
      label: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      downloads: map.get(key) || 0,
    });
  }
  return out;
}

export function AnalyticsPage() {
  const { analytics, downloads, publishedItems, items } = useData();

  const series = useMemo(() => build30DaySeries(analytics), [analytics]);
  const today = series[series.length - 1]?.downloads || 0;
  const yesterday = series[series.length - 2]?.downloads || 0;
  const weekTotal = series.slice(-7).reduce((s, d) => s + d.downloads, 0);
  const monthTotal = series.reduce((s, d) => s + d.downloads, 0);

  const topItems = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.downloads?.total || 0) - (a.downloads?.total || 0))
      .slice(0, 6);
  }, [items]);

  const typeBreakdown = useMemo(() => {
    const tally: Record<string, number> = { client: 0, mod: 0, macro: 0 };
    downloads.forEach((d) => {
      tally[d.itemType] = (tally[d.itemType] || 0) + 1;
    });
    return [
      { name: "Clients", value: tally.client || 0, color: "#8b5cf6" },
      { name: "Mods", value: tally.mod || 0, color: "#10b981" },
      { name: "Macros", value: tally.macro || 0, color: "#f59e0b" },
    ].filter((x) => x.value > 0);
  }, [downloads]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400">
          Track downloads, top items, and catalog growth over the last 30 days.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Today"
          value={formatNumber(today)}
          hint={`Yesterday: ${formatNumber(yesterday)}`}
          icon={<Calendar size={18} />}
          accent="violet"
        />
        <StatCard
          label="This Week"
          value={formatNumber(weekTotal)}
          hint="Last 7 days"
          icon={<TrendingUp size={18} />}
          accent="emerald"
        />
        <StatCard
          label="This Month"
          value={formatNumber(monthTotal)}
          hint="Last 30 days"
          icon={<BarChart3 size={18} />}
          accent="amber"
        />
        <StatCard
          label="Total Events"
          value={formatNumber(downloads.length)}
          hint={`${publishedItems.length} published items`}
          icon={<Download size={18} />}
          accent="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-base font-semibold text-white mb-3">
            30-day download trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <defs>
                  <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={32}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(14,14,22,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: "#8b5cf6" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-white mb-3">
            Type breakdown
          </h3>
          {typeBreakdown.length === 0 ? (
            <p className="text-sm text-slate-500 py-10 text-center">
              No data yet.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {typeBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(14,14,22,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-white mb-3">
          Top items by total downloads
        </h3>
        {topItems.length === 0 ? (
          <p className="text-sm text-slate-500">No items to rank yet.</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  type="number"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(14,14,22,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="downloads.total" radius={[0, 6, 6, 0]}>
                  {topItems.map((it, i) => (
                    <Cell
                      key={i}
                      fill={
                        it.type === "client"
                          ? "#8b5cf6"
                          : it.type === "mod"
                            ? "#10b981"
                            : "#f59e0b"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
