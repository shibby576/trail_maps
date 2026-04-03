export interface SampleTrail {
  id: string;
  name: string;
  location: string;
  distance: string;
  elevation: string;
  gpxPath: string;
}

export const SAMPLE_TRAILS: SampleTrail[] = [
  {
    id: "enchantments",
    name: "Enchantments Traverse",
    location: "Washington, USA",
    distance: "18.3 mi",
    elevation: "4,500 ft gain",
    gpxPath: "/samples/enchantments-traverse.gpx",
  },
  {
    id: "half-dome",
    name: "Half Dome via Mist Trail",
    location: "Yosemite, California",
    distance: "14.2 mi",
    elevation: "4,800 ft gain",
    gpxPath: "/samples/half-dome-mist-trail.gpx",
  },
  {
    id: "haute-route",
    name: "Haute Route",
    location: "Chamonix to Zermatt, Alps",
    distance: "111 mi",
    elevation: "36,000 ft gain",
    gpxPath: "/samples/haute-route.gpx",
  },
  {
    id: "appalachian-trail",
    name: "Appalachian Trail",
    location: "Georgia to Maine",
    distance: "2,190 mi",
    elevation: "464,500 ft gain",
    gpxPath: "/samples/appalachian-trail.gpx",
  },
];
