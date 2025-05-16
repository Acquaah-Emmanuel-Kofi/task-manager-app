import { Router } from "express";
import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUser,
} from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/users", handleCreateUser);
userRoutes.get("/users", handleGetAllUsers);
userRoutes.get("/users/:id", handleGetUser);

export default userRoutes;
