// app/api/status/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  subHours,
  subMinutes,
  addMinutes,
  isWithinInterval,
  format,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLOT_MINUTES = 10;
const WINDOW_HOURS = 24;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const botId = url.searchParams.get("botId") || "yasbot";

    const db = await getDb();
    const collection = db.collection("pings");

    const now = new Date();

    const cleanNow = setMilliseconds(setSeconds(now, 0), 0);
    const currentMinutes = cleanNow.getMinutes();
    const alignedMinutes =
      Math.floor(currentMinutes / SLOT_MINUTES) * SLOT_MINUTES;
    const alignedNow = setMinutes(cleanNow, alignedMinutes);
    const windowStart = subHours(alignedNow, WINDOW_HOURS);

    const pings = await collection
      .find({
        botId,
        createdAt: {
          $gte: windowStart,
          $lte: now,
        },
      })
      .sort({ createdAt: 1 })
      .toArray();

    const totalSlots = (WINDOW_HOURS * 60) / SLOT_MINUTES;
    const points: { time: string; status: number }[] = [];

    for (let i = 0; i < totalSlots; i++) {
      const slotStart = addMinutes(windowStart, i * SLOT_MINUTES);
      const slotEnd = addMinutes(slotStart, SLOT_MINUTES);

      const pingsInSlot = pings.filter((p) =>
        isWithinInterval(p.createdAt, { start: slotStart, end: slotEnd })
      );

      let status = 0;
      if (pingsInSlot.length > 0) {
        status = pingsInSlot.some((p) => p.status === 1) ? 1 : 0;
      }

      points.push({
        time: format(slotStart, "HH:mm", { locale: ptBR }),
        status,
      });
    }

    const fifteenMinutesAgo = subMinutes(now, 15);
    const lastPing = pings.length ? pings[pings.length - 1] : null;

    const online =
      lastPing &&
      lastPing.createdAt >= fifteenMinutesAgo &&
      (lastPing.status === undefined || lastPing.status === 1)
        ? true
        : false;

    return NextResponse.json({
      online,
      lastPing: lastPing ? lastPing.createdAt : null,
      points,
    });
  } catch (err) {
    console.error("STATUS ERROR", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
