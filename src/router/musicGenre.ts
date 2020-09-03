import { Router } from "express";
import MusicGenreController from "../controller/MusicGenreController";

const musicGenreRouter = Router();

musicGenreRouter.post("/add", new MusicGenreController().addGenre);
musicGenreRouter.get("/all", new MusicGenreController().getGenres);

export default musicGenreRouter;