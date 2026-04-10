import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { analyzeDomain } from "@/lib/dns-checks";

export async function POST(req: NextRequest) {
  try {
    const { domain, email } = await req.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }

    const clean = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0];

    const id        = uuidv4().replace(/-/g, "").slice(0, 16);
    const seedEmail = `test+${id}@burnedinbox.com`;

    const { score, checks } = analyzeDomain(clean);

    // In production: store session in Redis/DB keyed by id
    // For now we return all state to client; client polls /api/check-result
    return NextResponse.json({
      id,
      domain: clean,
      seedEmail,
      score,
      checks,
      createdAt: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
