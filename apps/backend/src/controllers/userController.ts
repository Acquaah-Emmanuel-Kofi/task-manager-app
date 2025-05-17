import { NextFunction, Request, Response } from "express";
import { createUserSchema } from "../validators/userValidator";
import { createUser, getAllUsers, getUserById } from "../models/userModel";

export const handleCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createUserSchema.parse(req.body);
    const user = await createUser(
      validated.name,
      validated.email,
      validated.password
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const handleGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (!user) res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const handleGetAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
