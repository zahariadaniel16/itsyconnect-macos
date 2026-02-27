import { NextResponse } from "next/server";
import { hasCredentials } from "@/lib/asc/client";
import { updateAppAttributes } from "@/lib/asc/apps";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appId: string }> },
) {
  const { appId } = await params;

  if (!hasCredentials()) {
    return NextResponse.json({ error: "No credentials" }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      contentRightsDeclaration?: string;
    };

    await updateAppAttributes(appId, {
      contentRightsDeclaration: body.contentRightsDeclaration,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
