import type { Request, Response } from "express";
import { UserService } from "../services/userService";
import { ApiResponse, UserData } from "../types";
import { NotFoundError, BadRequestError } from "../utils/httpErrors";

export class UserController {
  static getAllUsers = async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    const response: ApiResponse<UserData[]> = {
      success: true,
      data: users.map((user) => user.getUserData()),
    };
    res.status(200).json(response);
  };

  static getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const response: ApiResponse<UserData> = {
      success: true,
      data: user.getUserData(),
    };
    res.status(200).json(response);
  };

  static createUser = async (req: Request, res: Response) => {
    const { name, zipCode } = req.body;
    const user = await UserService.createUser({ name, zipCode });
    const response: ApiResponse<UserData> = {
      success: true,
      message: "User created successfully",
      data: user.getUserData(),
    };
    res.status(201).json(response);
  };

  static updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, zipCode } = req.body;

    if (!name && zipCode === undefined) {
      throw new BadRequestError(
        "At least one field (name or zipCode) must be provided for update"
      );
    }

    const user = await UserService.updateUser(id, { name, zipCode });

    const response: ApiResponse<UserData> = {
      success: true,
      message: "User updated successfully",
      data: user.getUserData(),
    };
    res.status(200).json(response);
  };

  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await UserService.deleteUser(id);

    if (!deleted) {
      throw new NotFoundError("User not found");
    }

    const response: ApiResponse = {
      success: true,
      message: "User deleted successfully",
    };
    res.status(200).json(response);
  };
}
