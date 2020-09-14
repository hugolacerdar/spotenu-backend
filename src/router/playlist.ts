import { Router } from "express";
import PlaylistController from "../controller/PlaylistController";

const playlistRouter = Router();

playlistRouter.post("/create", new PlaylistController().createPlaylist);
playlistRouter.put("/add_music", new PlaylistController().addMusic);

export default playlistRouter;