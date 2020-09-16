import { Request, Response } from "express";
import PlaylistDB from "../data/PlaylistDB";
import UserDB from "../data/UserDB";
import CreatePlaylistBusiness from "../business/CreatePlaylistBusiness";
import AddMusicToPlaylistBusiness from "../business/AddMusicToPlaylistBusiness";
import RemoveMusicFromPlaylistBusiness from "../business/RemoveMusicFromPlaylistBusiness";
import GetPlaylistsByUserIdBusiness from "../business/GetPlaylistsByUserIdBusiness";
import TurnPlaylistPublicBusiness from "../business/TurnPlaylistPublicBusiness";
import EditPlaylistNameBusiness from "../business/EditPlaylistNameBusiness";
import Authorizer from "../services/Authorizer";
import IdGenerator from "../services/IdGenerator";
import InvalidInputError from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import BaseDB from "../data/base/BaseDB";
import { UserRole } from "../model/User";
import { Permission } from "../model/Playlist";

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
                throw new InvalidInputError("Missing input data")
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
                throw new InvalidInputError("Missing input data")
            }
            const playlist = await addMusicToPlaylistBusiness.playlistDB.getById(playlistId);
            const isUserFollowing = await addMusicToPlaylistBusiness.playlistDB.isUserFollowing(userId, playlistId);


            if(userId !== playlist.getCreatorId() && !isUserFollowing){
                throw new UnauthorizedError("Unauthorized: premium members can only add musics to their own playlists or playlists they follow")
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

    public removeMusic = async (req: Request, res: Response) => {
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
                throw new InvalidInputError("Missing input data")
            }

            const playlist = await removeMusicFromPlaylistBusiness.playlistDB.getById(playlistId);
            const isUserFollowing = await removeMusicFromPlaylistBusiness.playlistDB.isUserFollowing(userId, playlistId);


            if(userId !== playlist.getCreatorId() && !isUserFollowing){
                throw new UnauthorizedError("Unauthorized: premium members can only remove musics from their own playlists or playlists they follow")
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

    public getPlaylistsByUserId = async (req: Request, res: Response) => {
        try {
            const getPlaylistsByUserIdBusiness = new GetPlaylistsByUserIdBusiness(new PlaylistDB());
            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Unauthorized: only premium listeners can perform this request");
            }

            const userId = authorizer.retrieveDataFromToken(token).userId;
            const page = Number(req.query.page);

            if(!page){
                throw new InvalidInputError("Missing input data")
            }

            if(page < 1){
                throw new InvalidInputError("Invalid input: page number must be at least 1")
            }

            const result = await getPlaylistsByUserIdBusiness.execute(userId, page);

            res.status(200).send({ result });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public turnPlaylistPublic = async (req: Request, res: Response) => {
        try {
            const turnPlaylistPublicBusiness = new TurnPlaylistPublicBusiness(new PlaylistDB());
            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Unauthorized: only premium listeners can perform this request");
            }

            const userId = authorizer.retrieveDataFromToken(token).userId;
            const playlistId = req.body.playlistId;

            if(!playlistId){
                throw new InvalidInputError("Missing input data")
            }

            const playlist = await turnPlaylistPublicBusiness.playlistDB.getById(playlistId);

            if(!playlist){
                throw new InvalidInputError("Invalid input: no playlist matching the input id")
            }

            if(userId !== playlist.getCreatorId()){
                throw new UnauthorizedError("Unauthorized: premium members can only turn their own playlists into public")
            }

            if(playlist.getPermission() === Permission.PUBLIC){
                throw new InvalidInputError("Playlist is already public")
            }

            await turnPlaylistPublicBusiness.execute(playlistId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public editName = async(req: Request, res: Response) => {
        try {
            const editPlaylistNameBusiness = new EditPlaylistNameBusiness(new PlaylistDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            const newName = req.body.newName;
            const playlistId = req.body.playlistId;

            if(!token){
                throw new UnauthorizedError("Missing token: only premium listeners can perform this request");
            }

            const tokenData = authorizer.retrieveDataFromToken(token)


            if (tokenData.userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Unauthorized: only premium listeners can perform this request");
            };
            
            const userId = tokenData.userId;
            
            const playlist = await editPlaylistNameBusiness.playlistDB.getById(playlistId);
            const isUserFollowing = await editPlaylistNameBusiness.playlistDB.isUserFollowing(userId, playlistId);
            
            
            if(userId !== playlist.getCreatorId() && !isUserFollowing){
                throw new UnauthorizedError("Unauthorized: premium members can only edit the name from their own playlists or playlists they follow")
            }
            
            if(!newName || !playlistId){
                throw new InvalidInputError("Missing input data");
            }

            await editPlaylistNameBusiness.execute(playlistId, newName);

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