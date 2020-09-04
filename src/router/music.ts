import { Router } from "express";
import MusicController from "../controller/MusicController";

const musicRouter = Router();

musicRouter.post("/add", new MusicController().createAlbum);

export default musicRouter;