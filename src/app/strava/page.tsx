"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Mountain, Bike, PersonStanding, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: number;
  name: string;
  type: string;
  distance_m: number;
  elevation_m: number;
  date: string;
}

function activityIcon(type: string) {
  if (type.includes("Ride") || type.includes("Bike")) return <Bike className="w-4 h-4" />;
  if (type.includes("Ski") || type.includes("Snow")) return <Mountain className="w-4 h-4" />;
  return <PersonStanding className="w-4 h-4" />;
}

function formatDistance(m: number) {
  const miles = m / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

function formatElevation(m: number) {
  const ft = m * 3.28084;
  return `${Math.round(ft).toLocaleString()} ft gain`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function StravaPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/strava/activities")
      .then((r) => {
        if (r.status === 401) throw new Error("auth");
        if (!r.ok) throw new Error("fetch");
        return r.json();
      })
      .then(setActivities)
      .catch((e) => {
        if (e.message === "auth") {
          router.replace("/");
        } else {
          setError("Couldn't load activities. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handlePick = async (activity: Activity) => {
    setLoadingId(activity.id);
    try {
      const res = await fetch(`/api/strava/gpx?id=${activity.id}`);
      if (!res.ok) throw new Error("gpx");
      const gpx = await res.text();
      sessionStorage.setItem("gpxContent", gpx);
      sessionStorage.setItem("gpxFileName", `${activity.name}.gpx`);
      router.push("/customize");
    } catch {
      setLoadingId(null);
      setError("Couldn't load that activity. Please try another.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      <header className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-semibold text-gray-900">TrailPlot</span>
          </div>
          <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 pb-12 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Activities</h2>
          <p className="text-gray-500 mt-1 text-sm">Pick one to turn into a poster</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {!loading && !error && activities.length === 0 && (
          <p className="text-gray-500 text-sm text-center">No recent activities found.</p>
        )}

        <div className="space-y-3">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => handlePick(a)}
              disabled={loadingId !== null}
              className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-4 hover:border-emerald-400 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-wait relative"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                  {activityIcon(a.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{a.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(a.date)} · {formatDistance(a.distance_m)} · {formatElevation(a.elevation_m)}
                  </p>
                </div>
                {loadingId === a.id && (
                  <div className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
