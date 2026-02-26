import { NextResponse } from "next/server";
import { listAppInfoLocalizations } from "@/lib/asc/app-info";
import { hasCredentials } from "@/lib/asc/client";
import { cacheGetMeta } from "@/lib/cache";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appId: string; appInfoId: string }> },
) {
  const { appInfoId } = await params;

  if (!hasCredentials()) {
    return NextResponse.json({ localizations: [], meta: null });
  }

  try {
    const localizations = await listAppInfoLocalizations(appInfoId);
    const meta = cacheGetMeta(`appInfoLocalizations:${appInfoId}`);

    return NextResponse.json({ localizations, meta });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
