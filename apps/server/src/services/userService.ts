import { db } from "../config/firebase";
import { getLocationDataByZipCode } from "./locationService";
import { User } from "../models/user";
import { UserData } from "../types";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/httpErrors";
const USERS_REF = "users";

const generateUserId = (): string => {
  const ref = db.ref(USERS_REF).push();
  if (!ref.key) {
    throw new InternalServerError("Failed to generate user ID");
  }
  return ref.key;
};

export class UserService {
  static getAllUsers = async (): Promise<User[]> => {
    const usersRef = db.ref(USERS_REF);
    const snapshot = await usersRef.once("value");
    const data = snapshot.val();
    if (!data) {
      return [];
    }
    return Object.values(data).map(
      (userData) => new User(userData as Partial<UserData>)
    );
  };

  static getUserById = async (userId: string): Promise<User | null> => {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const userRef = db.ref(`${USERS_REF}/${userId}`);
    const snapshot = await userRef.once("value");
    const data = snapshot.val();

    if (!data) {
      return null;
    }

    return new User(data);
  };

  static createUser = async (userData: Partial<UserData>): Promise<User> => {
    const { name, zipCode } = userData;

    // Name is required
    if (!name) {
      throw new BadRequestError("Name is required");
    }

    // Fetch location data from OpenWeatherMap
    const locationData = zipCode
      ? await getLocationDataByZipCode(zipCode)
      : null;

    // Create user object
    const userId = generateUserId();
    const user = new User({
      id: userId,
      name: name.trim(),
      zipCode: zipCode?.trim(),
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
      timezone: locationData?.timezone,
    });

    // Validate user data
    const validation = user.validate();
    if (!validation.valid) {
      throw new BadRequestError(
        `User validation failed: ${validation.errors.join(", ")}`
      );
    }

    // Save to Firebase
    const userRef = db.ref(`${USERS_REF}/${userId}`);
    await userRef.set(user.getUserData());

    return user;
  };

  static updateUser = async (
    userId: string,
    updateData: Partial<UserData>
  ): Promise<User> => {
    if (!userId) {
      throw new BadRequestError("User ID is required to update");
    }

    // Get existing user
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // Determine if zip code was explicitly provided (including null to clear it)
    const zipCodeProvided = "zipCode" in updateData;
    const newZipCode = zipCodeProvided ? updateData.zipCode : undefined;
    const zipCodeChanged =
      zipCodeProvided && newZipCode !== existingUser.zipCode;

    // If zip code changed, fetch new location data (or clear if null)
    let locationData = null;
    if (zipCodeChanged && newZipCode && typeof newZipCode === "string") {
      // zipCode is a non-null string, fetch location data
      locationData = await getLocationDataByZipCode(newZipCode);
    }

    // Build update object
    const updatedUser = new User({
      id: existingUser.id,
      name: updateData.name ? updateData.name.trim() : existingUser.name,
      zipCode: zipCodeProvided
        ? newZipCode === null
          ? null
          : typeof newZipCode === "string"
          ? newZipCode.trim()
          : existingUser.zipCode
        : existingUser.zipCode,
      latitude:
        zipCodeChanged && newZipCode === null
          ? null
          : locationData
          ? locationData.latitude
          : existingUser.latitude,
      longitude:
        zipCodeChanged && newZipCode === null
          ? null
          : locationData
          ? locationData.longitude
          : existingUser.longitude,
      timezone:
        zipCodeChanged && newZipCode === null
          ? null
          : locationData
          ? locationData.timezone
          : existingUser.timezone,
    });

    // Validate updated user
    const validation = updatedUser.validate();
    if (!validation.valid) {
      throw new BadRequestError(
        `User validation failed: ${validation.errors.join(", ")}`
      );
    }

    // Update in Firebase
    const userRef = db.ref(`${USERS_REF}/${userId}`);
    await userRef.update(updatedUser.getUserData());

    return updatedUser;
  };

  static deleteUser = async (userId: string): Promise<boolean> => {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const userRef = db.ref(`${USERS_REF}/${userId}`);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) {
      return false;
    }

    await userRef.remove();
    return true;
  };
}
