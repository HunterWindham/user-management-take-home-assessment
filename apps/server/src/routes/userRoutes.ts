import express from "express";
import { UserController } from "../controllers/userController";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.post("/", UserController.createUser);

router.put("/:id", UserController.updateUser);

router.patch("/:id", UserController.partialUpdateUser);

router.delete("/:id", UserController.deleteUser);

export default router;
