"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type PingPoint = {
  time: string;
  status: number;
};

type PingsChartProps = {
  data: PingPoint[];
};

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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <YAxis
                ticks={[0, 1]}
                domain={[0, 1]}
                tickLine={false}
                axisLine={false}
                width={30}
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) =>
                  value === 1 ? "Online" : "Offline"
                }
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <ReferenceLine y={1} stroke="#22c55e30" />
              <ReferenceLine y={0} stroke="#ef444430" />
              <Line
                type="stepAfter"
                dataKey="status"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
