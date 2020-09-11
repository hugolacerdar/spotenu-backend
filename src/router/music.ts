import { Router } from "express";
import MusicController from "../controller/MusicController";

const musicRouter = Router();

musicRouter.post("/add", new MusicController().createMusic);
musicRouter.get("/search", new MusicController().getByText);
musicRouter.get("/data", new MusicController().getDataById);

export default musicRouter;