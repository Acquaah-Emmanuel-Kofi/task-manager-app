import { Router } from "express";
import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUser,
} from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/", handleCreateUser);
userRoutes.get("/", handleGetAllUsers);
userRoutes.get("/:id", handleGetUser);

export default userRoutes;
