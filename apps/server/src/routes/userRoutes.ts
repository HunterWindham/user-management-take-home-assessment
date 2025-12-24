import express from "express";
import { UserController } from "../controllers/userController";
import {
  validateUserCreate,
  validateUserUpdate,
  handleValidationErrors,
} from "../middleware/validation";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.post(
  "/",
  validateUserCreate,
  handleValidationErrors,
  UserController.createUser
);

router.put(
  "/:id",
  validateUserUpdate,
  handleValidationErrors,
  UserController.updateUser
);

router.delete("/:id", UserController.deleteUser);

export default router;
