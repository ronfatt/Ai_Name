import { NextResponse } from "next/server";
import { trackAdminEvent, type AdminTrackPayload } from "@/lib/admin/tracking";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "form_submit",
  "report_generated",
  "whatsapp_click",
  "lead_capture",
  "paid_preview_unlock",
  "facebook_share_click"
]);

export async function POST(request: Request) {
  let body: AdminTrackPayload;

  try {
    body = (await request.json()) as AdminTrackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.eventType || !allowedEvents.has(body.eventType)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  try {
    await trackAdminEvent({
      ...body,
      source: body.source || "webapp"
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track event failed:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
