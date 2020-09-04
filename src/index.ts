import express from "express";
import userRouter from "./router/user";
import musicGenreRouter from "./router/musicGenre";
import albumRouter from "./router/album";
import musicRouter from "./router/music";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json())

app.use("/users", userRouter);
app.use("/genres", musicGenreRouter);
app.use("/album", albumRouter);
app.use("/music", musicRouter);

export default app;