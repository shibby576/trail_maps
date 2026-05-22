import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://trailplot.com").trim();

  if (!clientId) {
    return NextResponse.json({ error: "Strava not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/strava/callback`,
    response_type: "code",
    scope: "activity:read_all",
    approval_prompt: "auto",
  });

  return NextResponse.redirect(`https://www.strava.com/oauth/authorize?${params}`);
}
