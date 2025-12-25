import db from "../config/firebase";
import { getLocationDataByZipCode } from "./locationService";
import { User } from "../models/user";
import { UserData } from "../types";
const USERS_REF = "users";

const generateUserId = (): string => {
  const ref = db.ref(USERS_REF).push();
  return ref.key || "";
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
      throw new Error("User ID is required");
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
      throw new Error("Name is required");
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
      throw new Error("User validation failed");
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
      throw new Error("User ID is required to update");
    }

    // Get existing user
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Determine if zip code changed
    const zipCodeChanged =
      updateData.zipCode && updateData.zipCode !== existingUser.zipCode;

    // If zip code changed, fetch new location data
    let locationData = null;
    if (zipCodeChanged && updateData.zipCode) {
      locationData = await getLocationDataByZipCode(updateData.zipCode);
    }
    // Build update object
    const updatedUser = new User({
      id: existingUser.id,
      name: updateData.name ? updateData.name.trim() : existingUser.name,
      zipCode: updateData.zipCode
        ? updateData.zipCode.trim()
        : existingUser.zipCode,
      latitude: locationData ? locationData.latitude : existingUser.latitude,
      longitude: locationData ? locationData.longitude : existingUser.longitude,
      timezone: locationData ? locationData.timezone : existingUser.timezone,
    });

    // Validate updated user
    const validation = updatedUser.validate();
    if (!validation.valid) {
      throw new Error("User validation failed");
    }

    // Update in Firebase
    const userRef = db.ref(`${USERS_REF}/${userId}`);
    await userRef.update(updatedUser.getUserData());

    return updatedUser;
  };

  static deleteUser = async (userId: string): Promise<boolean> => {
    if (!userId) {
      throw new Error("User ID is required");
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
