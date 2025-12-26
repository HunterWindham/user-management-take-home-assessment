import express from "express";
import { UserController } from "../controllers/userController";
import { validate } from "../middleware/validation";
import * as userValidation from "../validations/user.validation";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.post(
  "/",
  validate(userValidation.createUser),
  UserController.createUser
);

router.put(
  "/:id",
  validate(userValidation.updateUser),
  UserController.updateUser
);

router.delete("/:id", UserController.deleteUser);

export default router;
