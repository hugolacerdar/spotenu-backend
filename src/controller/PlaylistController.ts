import { Request, Response } from "express";
import PlaylistDB from "../data/PlaylistDB";
import UserDB from "../data/UserDB";
import CreatePlaylistBusiness from "../business/CreatePlaylistBusiness";
import AddMusicToPlaylistBusiness from "../business/AddMusicToPlaylistBusiness";
import RemoveMusicFromPlaylistBusiness from "../business/RemoveMusicFromPlaylistBusiness";
import Authorizer from "../services/Authorizer";
import IdGenerator from "../services/IdGenerator";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import BaseDB from "../data/base/BaseDB";
import { UserRole } from "../model/User";

export default class PlaylistController {
    public createPlaylist = async (req: Request, res: Response) => {
        try {
            const createPlaylistBusiness = new CreatePlaylistBusiness(new PlaylistDB(), new UserDB(), new IdGenerator());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            
            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Unauthorized: only premium listeners can create a playlist");
            }

            const creatorId = authorizer.retrieveDataFromToken(token).userId;

            const name = req.body.name;

            if(!name){
                throw new InvalidInput("Missing input data")
            }


            await createPlaylistBusiness.execute(name, creatorId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public addMusic= async (req: Request, res: Response) => {
        try {
            const addMusicToPlaylistBusiness = new AddMusicToPlaylistBusiness(new PlaylistDB());
            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Unauthorized: only premium listeners can perform this request");
            }

            const userId = authorizer.retrieveDataFromToken(token).userId;

            const playlistId = req.body.playlistId;
            const musicId = req.body.musicId;

            if(!playlistId || !musicId){
                throw new InvalidInput("Missing input data")
            }

            if(!(await addMusicToPlaylistBusiness.playlistDB.isUserCreator(userId, playlistId))){
                throw new UnauthorizedError("Unauthorized: premium members can only add musics to their own playlists")
            }

            await addMusicToPlaylistBusiness.execute(playlistId, musicId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public removeMusic= async (req: Request, res: Response) => {
        try {
            const removeMusicFromPlaylistBusiness = new RemoveMusicFromPlaylistBusiness(new PlaylistDB());
            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Unauthorized: only premium listeners can perform this request");
            }

            const userId = authorizer.retrieveDataFromToken(token).userId;

            const playlistId = req.body.playlistId;
            const musicId = req.body.musicId;

            if(!playlistId || !musicId){
                throw new InvalidInput("Missing input data")
            }

            if(!(await removeMusicFromPlaylistBusiness.playlistDB.isUserCreator(userId, playlistId))){
                throw new UnauthorizedError("Unauthorized: premium members can only remove music from their own playlists")
            }

            await removeMusicFromPlaylistBusiness.execute(playlistId, musicId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }
}