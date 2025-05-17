import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "../schemas/authSchema";
import { findUserByEmail, createUserWithPassword } from "../models/authModel";
import { generateToken } from "../utils/jwt";

export const handleRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUserWithPassword(name, email, hashed);
    const token = generateToken(newUser.id);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await findUserByEmail(email);
    if (!user) res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
