import { Router } from "express";
import PlaylistController from "../controller/PlaylistController";

const playlistRouter = Router();

playlistRouter.post("/create", new PlaylistController().createPlaylist);
playlistRouter.put("/add_music", new PlaylistController().addMusic);
playlistRouter.delete("/remove_music", new PlaylistController().removeMusic);
playlistRouter.get("/list", new PlaylistController().getPlaylistsByUserId);
playlistRouter.put("/change_permission", new PlaylistController().turnPlaylistPublic);
playlistRouter.put("/edit", new PlaylistController().editName);

export default playlistRouter;