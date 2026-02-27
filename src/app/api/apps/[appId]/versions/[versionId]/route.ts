import { NextResponse } from "next/server";
import { updateVersionAttributes, invalidateVersionsCache } from "@/lib/asc/version-mutations";
import { hasCredentials } from "@/lib/asc/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appId: string; versionId: string }> },
) {
  const { appId, versionId } = await params;

  if (!hasCredentials()) {
    return NextResponse.json({ error: "No ASC credentials" }, { status: 400 });
  }

  const body = await request.json();
  const { versionString } = body as { versionString?: string };

  if (!versionString) {
    return NextResponse.json(
      { error: "versionString is required" },
      { status: 400 },
    );
  }

  try {
    await updateVersionAttributes(versionId, { versionString });
    invalidateVersionsCache(appId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
