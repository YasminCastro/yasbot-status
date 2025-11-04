"use client";

import { useEffect, useState } from "react";
import { MonitoringHeader } from "@/components/monitoring/header";
import { StatusCard } from "@/components/monitoring/status-card";
import { PingsChart } from "@/components/monitoring/pings-chart";

type StatusResponse = {
  online: boolean;
  lastPing: string | null;
  points: { time: string; status: number }[];
};

export default function Home() {
  const [data, setData] = useState<StatusResponse | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch("/api/status");
      const json = await res.json();
      setData(json);
    }
    fetchStatus();

    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = data?.online ?? false;
  const lastUpdated = data?.lastPing
    ? new Date(data.lastPing).toLocaleString()
    : "sem dados";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MonitoringHeader isOnline={isOnline} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        <StatusCard isOnline={isOnline} lastUpdated={lastUpdated} />
        <PingsChart data={data?.points ?? []} />
      </main>
    </div>
  );
}
