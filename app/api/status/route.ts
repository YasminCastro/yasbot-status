// app/api/status/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const SLOT_MINUTES = 10;
const WINDOW_HOURS = 24;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const botId = url.searchParams.get("botId") || "default";

    const db = await getDb();
    const collection = db.collection("pings");

    const now = new Date();
    const start = new Date(now.getTime() - WINDOW_HOURS * 60 * 60 * 1000);

    const pings = await collection
      .find({
        botId,
        createdAt: { $gte: start, $lte: now },
      })
      .sort({ createdAt: 1 })
      .toArray();

    const totalSlots = (WINDOW_HOURS * 60) / SLOT_MINUTES;
    const slots: { time: string; status: number }[] = [];

    for (let i = 0; i < totalSlots; i++) {
      const slotStart = new Date(
        start.getTime() + i * SLOT_MINUTES * 60 * 1000
      );
      const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60 * 1000);

      // tem algum ping dentro desse intervalo?
      const hasPing = pings.some(
        (p) => p.createdAt >= slotStart && p.createdAt < slotEnd
      );

      // formata horário hh:mm
      const hh = slotStart.getHours().toString().padStart(2, "0");
      const mm = slotStart.getMinutes().toString().padStart(2, "0");

      slots.push({
        time: `${hh}:${mm}`,
        status: hasPing ? 1 : 0,
      });
    }

    // está online se teve ping nos últimos 15 minutos
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const lastPing = pings.length ? pings[pings.length - 1].createdAt : null;
    const isOnline = lastPing && lastPing >= fifteenMinutesAgo ? true : false;

    return NextResponse.json({
      online: isOnline,
      lastPing,
      points: slots,
    });
  } catch (err) {
    console.error("STATUS ERROR", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
