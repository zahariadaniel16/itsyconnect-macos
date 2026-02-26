import { NextResponse } from "next/server";
import { listLocalizations } from "@/lib/asc/localizations";
import { hasCredentials } from "@/lib/asc/client";
import { cacheGetMeta } from "@/lib/cache";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appId: string; versionId: string }> },
) {
  const { versionId } = await params;

  if (!hasCredentials()) {
    return NextResponse.json({ localizations: [], meta: null });
  }

  try {
    const localizations = await listLocalizations(versionId);
    const meta = cacheGetMeta(`localizations:${versionId}`);

    return NextResponse.json({ localizations, meta });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
