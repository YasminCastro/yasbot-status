// app/api/ping/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const secret = process.env.PING_SECRET;
    const body = await req.json().catch(() => ({}));
    const { botId = "default" } = body;

    const headerSecret = req.headers.get("x-ping-secret");
    if (secret && headerSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const collection = db.collection("pings");

    await collection.insertOne({
      botId,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PING ERROR", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
