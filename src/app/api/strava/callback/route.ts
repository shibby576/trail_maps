import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://trailplot.com";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?strava_error=access_denied`);
  }

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    return NextResponse.redirect(`${baseUrl}/?strava_error=token_exchange`);
  }

  const data = await res.json();
  const token = data.access_token;

  const response = NextResponse.redirect(`${baseUrl}/strava`);
  response.cookies.set("strava_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 20, // 20 minutes
    path: "/",
  });

  return response;
}
