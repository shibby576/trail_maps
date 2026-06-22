import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("strava_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?per_page=20",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: res.status });
  }

  const activities = await res.json();

  const simplified = activities
    .filter((a: { type: string }) =>
      ["Run", "Ride", "Hike", "Walk", "Trail Run", "Mountain Bike Ride", "Gravel Ride", "BackcountrySki", "NordicSki", "Snowshoe"].includes(a.type)
    )
    .map((a: { id: number; name: string; type: string; distance: number; total_elevation_gain: number; start_date_local: string; start_latlng: [number, number] | null }) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      distance_m: a.distance,
      elevation_m: a.total_elevation_gain,
      date: a.start_date_local,
      start_latlng: a.start_latlng,
    }));

  return NextResponse.json(simplified);
}
