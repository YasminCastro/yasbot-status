"use client";

import { Badge } from "@/components/ui/badge";

type MonitoringHeaderProps = {
  isOnline: boolean;
};

export function MonitoringHeader({ isOnline }: MonitoringHeaderProps) {
  return (
    <header className="border-b bg-background/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            Y
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">YasTech</p>
            <p className="text-xs text-muted-foreground">
              Monitoramento do bot
            </p>
          </div>
        </div>

        <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>
    </header>
  );
}
