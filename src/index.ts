import express from "express";
import userRouter from "./router/user";
import dotenv from "dotenv";
import musicGenreRouter from "./router/musicGenre";

dotenv.config();

const app = express();
app.use(express.json())

app.use("/users", userRouter);
app.use("/genres", musicGenreRouter);

export default app;