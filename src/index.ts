import express from "express";
import userRouter from "./router/user";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json())

app.use("/users", userRouter);

export default app;