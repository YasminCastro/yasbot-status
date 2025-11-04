// app/api/check-status/route.ts
import { NextResponse } from "next/server";
import { sendAlertEmail } from "@/lib/alert";
import { subMinutes } from "date-fns";

export const runtime = "nodejs";

let lastKnownStatus = true;
let lastAlertAt: Date | null = null;
const ALERT_COOLDOWN_MINUTES = 30;

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("❌ NEXT_PUBLIC_BASE_URL não configurada");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const res = await fetch(`${baseUrl}/api/status`);
    const data = await res.json();

    const now = new Date();

    if (lastKnownStatus && !data.online) {
      const canAlert =
        !lastAlertAt ||
        subMinutes(now, ALERT_COOLDOWN_MINUTES) > (lastAlertAt as Date);

      if (canAlert) {
        await sendAlertEmail(
          "🚨 YasBot caiu!",
          "O bot YasTech está offline há mais de 15 minutos. Verifique o servidor."
        );
        lastAlertAt = now;
      }
    }

    lastKnownStatus = data.online;

    return NextResponse.json({ ok: true, online: data.online });
  } catch (err) {
    console.error("CHECK-STATUS ERROR", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
