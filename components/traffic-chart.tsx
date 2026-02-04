"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";
import type { TrafficData } from "@/types/admin";

interface TrafficChartProps {
  data: TrafficData[];
}

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-purple-500/40 bg-gray-900/98 backdrop-blur-sm p-4 shadow-2xl shadow-purple-500/20">
        <p className="font-bold text-gray-100 mb-2 text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 mb-1"
          >
            <span className="text-xs text-gray-400 capitalize">
              {entry.name}:
            </span>
            <span className="font-semibold text-sm text-purple-400">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, stroke, value } = props;
  if (value === undefined) return null;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#1f2937"
        stroke="#8b5cf6"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={6} fill="#8b5cf6" opacity={0.3} />
    </g>
  );
};

export function TrafficChart({ data }: TrafficChartProps) {
  // Filter out entries with zero traffic to show a proper curve
  const chartData = data.filter((item) => item.traffic > 0);

  // Calculate statistics
  const totalTraffic = chartData.reduce((sum, item) => sum + item.traffic, 0);
  const avgTraffic =
    chartData.length > 0 ? Math.round(totalTraffic / chartData.length) : 0;
  const maxTraffic =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.traffic))
      : 0;
  const trend =
    chartData.length >= 2
      ? (
          ((chartData[chartData.length - 1].traffic - chartData[0].traffic) /
            chartData[0].traffic) *
          100
        ).toFixed(1)
      : 0;

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 text-purple-500" />
              <span className="text-gray-100">Traffic Analytics</span>
            </CardTitle>
            <CardDescription className="text-base text-gray-400">
              API request patterns and trends over time
            </CardDescription>
          </div>

          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Average</p>
              <p className="text-lg font-bold text-purple-400">
                {avgTraffic.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Peak</p>
              <p className="text-lg font-bold text-purple-400">
                {maxTraffic.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Trend
              </p>
              <p
                className={`text-lg font-bold ${Number(trend) >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {Number(trend) >= 0 ? "+" : ""}
                {trend}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-2xl bg-gray-900/70 backdrop-blur-sm border border-gray-800 p-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#c4b5fd" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                strokeOpacity={0.5}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
                tickLine={false}
                dy={10}
              />

              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dx={-10}
                tickFormatter={(value) => value.toLocaleString()}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#8b5cf6",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                  strokeOpacity: 0.5,
                }}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#e5e7eb",
                }}
                iconType="circle"
              />

              <Area
                type="monotone"
                dataKey="traffic"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#colorTraffic)"
                dot={<CustomDot />}
                activeDot={{
                  r: 8,
                  fill: "#8b5cf6",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))",
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
