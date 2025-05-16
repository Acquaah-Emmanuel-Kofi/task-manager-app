import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (_req, res) => {
  res.send("Task Manager API is running");
});
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

// Server running
app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
