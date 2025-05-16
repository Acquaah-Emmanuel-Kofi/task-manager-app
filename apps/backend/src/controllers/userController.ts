import { Request, Response } from "express";
import { createUserSchema } from "../validators/userValidator";
import { createUser, getAllUsers, getUserById } from "../models/userModel";

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const validated = createUserSchema.parse(req.body);
    const user = await createUser(validated.name, validated.email);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};

export const handleGetUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (!user) res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};

export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
};
