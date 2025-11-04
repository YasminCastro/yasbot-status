"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type MonitoringHeaderProps = {
  isOnline: boolean;
};

export function MonitoringHeader({ isOnline }: MonitoringHeaderProps) {
  return (
    <header className="border-b bg-background/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="YasTech.png" alt="YasTech" />
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              Y
            </AvatarFallback>
          </Avatar>

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
