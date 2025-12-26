import axios from "axios";
import type { LocationData } from "../types/index.js";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../utils/httpErrors";

// Default to US if country code not provided
const DEFAULT_COUNTRY_CODE = "US";

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
    throw new InternalServerError("Missing OWM_API_KEY environment variable");
  }

  if (!zipCode || typeof zipCode !== "string") {
    throw new BadRequestError("Valid zip code is required");
  }

  try {
    // OpenWeatherMap requires zip code with country code (e.g., "10001,US")
    // If zipCode already contains a comma, assume country code is included
    const zipWithCountry = zipCode.includes(",")
      ? zipCode
      : `${zipCode},${DEFAULT_COUNTRY_CODE}`;

    const response = await axios.get<OpenWeatherMapResponse>(BASE_URL, {
      params: {
        zip: zipWithCountry,
        appid: OWM_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    const { coord, timezone } = response.data;

    if (!coord || coord.lat === undefined || coord.lon === undefined) {
      throw new InternalServerError("Invalid response from location service: missing coordinates");
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Zip code not found. Please verify the zip code is correct.");
      }
      if (error.response?.status === 401) {
        throw new InternalServerError("Invalid API key for location service");
      }
      throw new BadRequestError(
        `Location lookup failed: ${error.response?.data?.message || error.message}`
      );
    }
    throw new InternalServerError(
      `Location lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
