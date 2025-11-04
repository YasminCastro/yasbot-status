// app/api/ping/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const secret = process.env.PING_SECRET;
    const headerSecret = req.headers.get("x-ping-secret");

    if (secret && headerSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const botId = body.botId ?? "default";
    const status = typeof body.status === "number" ? body.status : 1;

    const db = await getDb();
    const collection = db.collection("pings");

    await collection.insertOne({
      botId,
      status, // 1 = ok, 0 = caiu
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PING ERROR", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
