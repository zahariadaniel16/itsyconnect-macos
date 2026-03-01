import { NextResponse } from "next/server";
import { getFeedbackCrashLog } from "@/lib/asc/testflight";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ feedbackId: string }> },
) {
  const { feedbackId } = await params;

  try {
    const result = await getFeedbackCrashLog(feedbackId);
    if (!result) {
      return NextResponse.json({ error: "Crash log not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
