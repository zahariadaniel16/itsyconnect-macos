import { NextResponse } from "next/server";
import { listScreenshotSets } from "@/lib/asc/screenshots";
import { hasCredentials } from "@/lib/asc/client";
import { cacheGetMeta } from "@/lib/cache";


export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      appId: string;
      versionId: string;
      localizationId: string;
    }>;
  },
) {
  const { localizationId } = await params;

  if (!hasCredentials()) {
    return NextResponse.json({ screenshotSets: [], meta: null });
  }

  try {
    const screenshotSets = await listScreenshotSets(localizationId);
    const meta = cacheGetMeta(`screenshotSets:${localizationId}`);

    return NextResponse.json({ screenshotSets, meta });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
