import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const resp = await fetch(`${process.env.BACKEND_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!resp.ok) {
      const message =
        data?.error || data?.detail || data?.raw || resp.statusText || "Backend error";
      return NextResponse.json({ error: message }, { status: resp.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("POST /api/recommend error:", err);
    const message = err?.message || "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
