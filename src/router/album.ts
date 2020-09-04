import { Router } from "express";
import AlbumController from "../controller/AlbumController";

const albumRouter = Router();

albumRouter.post("/create", new AlbumController().createAlbum);

export default albumRouter;