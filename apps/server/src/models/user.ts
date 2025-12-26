import type { UserData, ValidationResult } from "../types";

export class User {
  public id: string;
  public name: string;
  public zipCode: string | null;
  public latitude: number | null;
  public longitude: number | null;
  public timezone: string | null;

  constructor(data: Partial<UserData>) {
    this.id = data.id ?? "";
    this.name = data.name ?? "";
    this.zipCode = data.zipCode ?? null;
    this.latitude = data.latitude ?? null;
    this.longitude = data.longitude ?? null;
    this.timezone = data.timezone ?? null;
  }

  validate(): ValidationResult {
    const errors: string[] = [];

    if (
      !this.name ||
      typeof this.name !== "string" ||
      this.name.trim().length === 0
    ) {
      errors.push("Name is required and must be a non-empty string");
    }

    // If zipCode is provided, it must be a non-empty string
    // If zipCode is null, that's valid (location data may not be available)
    if (
      this.zipCode !== null &&
      (typeof this.zipCode !== "string" || this.zipCode.trim().length === 0)
    ) {
      errors.push("Zip code must be a non-empty string if provided");
    }

    if (
      this.latitude !== null &&
      (typeof this.latitude !== "number" || isNaN(this.latitude))
    ) {
      errors.push("Latitude must be a valid number");
    }

    if (
      this.longitude !== null &&
      (typeof this.longitude !== "number" || isNaN(this.longitude))
    ) {
      errors.push("Longitude must be a valid number");
    }

    if (this.timezone !== null && typeof this.timezone !== "string") {
      errors.push("Timezone must be a string");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getUserData(): UserData {
    return {
      id: this.id,
      name: this.name,
      zipCode: this.zipCode,
      latitude: this.latitude,
      longitude: this.longitude,
      timezone: this.timezone,
    };
  }
}
