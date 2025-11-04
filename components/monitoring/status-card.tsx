"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CircleCheck, CircleX } from "lucide-react";

type StatusCardProps = {
  isOnline: boolean;
  lastUpdated: string;
};

export function StatusCard({ isOnline, lastUpdated }: StatusCardProps) {
  return (
    <Card className="border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">YasTech está funcionando?</CardTitle>
          <CardDescription>Última atualização: {lastUpdated}</CardDescription>
        </div>
        {isOnline ? (
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">
            <CircleCheck className="h-4 w-4" />
            Sim
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-100">
            <CircleX className="h-4 w-4" />
            Não
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
