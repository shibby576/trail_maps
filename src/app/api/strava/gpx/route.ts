import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("strava_token")?.value;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!id) {
    return NextResponse.json({ error: "Missing activity id" }, { status: 400 });
  }

  const res = await fetch(
    `https://www.strava.com/api/v3/activities/${id}/streams?keys=latlng,altitude&key_by_type=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch streams" }, { status: res.status });
  }

  const streams = await res.json();
  const latlng: [number, number][] = streams.latlng?.data ?? [];
  const altitude: number[] = streams.altitude?.data ?? [];

  const trkpts = latlng
    .map(([lat, lon], i) => {
      const ele = altitude[i] != null ? `<ele>${altitude[i].toFixed(1)}</ele>` : "";
      return `      <trkpt lat="${lat}" lon="${lon}">${ele}</trkpt>`;
    })
    .join("\n");

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrailPlot" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;

  // Deauthorize immediately after fetching — frees up the connected athlete slot.
  // Fire-and-forget: don't block the response if it fails.
  fetch("https://www.strava.com/oauth/deauthorize", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});

  const response = new NextResponse(gpx, {
    headers: { "Content-Type": "application/gpx+xml" },
  });
  response.cookies.delete("strava_token");
  return response;
}
