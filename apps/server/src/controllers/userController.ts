import type { Request, Response } from "express";

export class UserController {
  static getAllUsers = async (req: Request, res: Response) => {
    res.send(`get /users123`);
  };

  static getUserById = async (req: Request, res: Response) => {
    res.send(`get /users/${req.params.id}`);
  };

  static createUser = async (req: Request, res: Response) => {
    res.send(`post /users`);
  };

  static updateUser = async (req: Request, res: Response) => {
    res.send(`put /users/${req.params.id}`);
  };

  static partialUpdateUser = async (req: Request, res: Response) => {
    res.send(`patch /users/${req.params.id}`);
  };

  static deleteUser = async (req: Request, res: Response) => {
    res.send(`delete /users/${req.params.id}`);
  };
}
