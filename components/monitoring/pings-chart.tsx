"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type PingPoint = {
  time: string;
  datetime?: string;
  status: number;
};

type PingsChartProps = {
  data: PingPoint[];
};

const chartConfig = {
  status: {
    label: "Status",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export function PingsChart({ data }: PingsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Disponibilidade (últimas 24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full min-w-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="time"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  ticks={[0, 1]}
                  domain={[0, 1]}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickFormatter={(value) => {
                    if (value === 1) return "Online";
                    if (value === 0) return "Offline";
                    return "";
                  }}
                />
                <ReferenceLine y={1} stroke="#22c55e30" />
                <ReferenceLine y={0} stroke="#ef444430" />

                <ChartTooltip
                  cursor={{
                    stroke: "hsl(var(--muted-foreground))",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(_, payload: any[]) => {
                        const first = payload?.[0];
                        const iso = first?.payload?.datetime;
                        if (!iso) return first?.payload?.time ?? "";
                        const d = new Date(iso);
                        const dateStr = d.toLocaleDateString("pt-BR");
                        const timeStr = d.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return `${dateStr} ${timeStr}`;
                      }}
                      formatter={(value: any, name: any) => {
                        if (name === "status") {
                          const isOnline = value === 1;
                          const color = isOnline ? "#22c55e" : "#ef4444";
                          const text = isOnline ? "Online" : "Offline";

                          return (
                            <span
                              className="font-medium"
                              style={{ color: color }}
                            >
                              {text}
                            </span>
                          );
                        }
                        return value;
                      }}
                    />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="status"
                  stroke="url(#lineColor)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
