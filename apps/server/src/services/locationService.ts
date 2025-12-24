import axios from "axios";
import type { LocationData } from "../types/index.js";

const OWM_API_KEY = process.env.OWM_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

interface OpenWeatherMapResponse {
  coord: {
    lat: number;
    lon: number;
  };
  timezone: number;
}

/**
 * Fetches latitude, longitude, and timezone for a given zip code
 */
export async function getLocationDataByZipCode(
  zipCode: string
): Promise<LocationData> {
  if (!OWM_API_KEY) {
    throw new Error("Missing OWM_API_KEY");
  }

  if (!zipCode || typeof zipCode !== "string") {
    throw new Error("Valid zip code is required");
  }

  const response = await axios.get<OpenWeatherMapResponse>(BASE_URL, {
    params: {
      zip: zipCode,
      appid: OWM_API_KEY,
    },
    timeout: 10000, // 10 second timeout
  });

  const { coord, timezone } = response.data;

  if (!coord || coord.lat === undefined || coord.lon === undefined) {
    throw new Error("Invalid response: missing coordinates");
  }

  // OpenWeatherMap returns timezone offset in seconds, convert to timezone string
  // Format: UTC offset as ±HH:MM
  const timezoneOffsetSeconds = timezone;
  const timezoneOffsetHours = Math.floor(timezoneOffsetSeconds / 3600);
  const timezoneOffsetMinutes = Math.floor(
    Math.abs(timezoneOffsetSeconds % 3600) / 60
  );

  // Format hours with sign and padding
  const sign = timezoneOffsetHours >= 0 ? "+" : "-";
  const hoursStr = String(Math.abs(timezoneOffsetHours)).padStart(2, "0");
  const minutesStr = String(timezoneOffsetMinutes).padStart(2, "0");
  const timezoneString = `UTC${sign}${hoursStr}:${minutesStr}`;

  return {
    latitude: coord.lat,
    longitude: coord.lon,
    timezone: timezoneString,
  };
}
