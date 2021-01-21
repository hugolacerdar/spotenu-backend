import { Request, Response } from "express";
import MusicDB from "../data/MusicDB";
import CreateMusicBusiness from "../business/CreateMusicBusiness";
import SearchMusicBusiness from "../business/SearchMusicBusiness";
import GetMusicDataBusiness from "../business/GetMusicDataBusiness";
import EditMusicNameBusiness from "../business/EditMusicNameBusiness";
import DeleteMusicBusiness from "../business/DeleteMusicBusiness";
import ChangeAlbumBusiness from "../business/ChangeAlbumBusiness";
import Authorizer from "../services/Authorizer";
import IdGenerator from "../services/IdGenerator";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import { UserRole } from "../model/User";
import BaseDB from "../data/base/BaseDB";
import NotFoundError from "../error/NotFoundError";
import AlbumDB from "../data/AlbumDB";

export default class MusicController {
    public createMusic= async (req: Request, res: Response) => {
        try {
            const createMusicBusiness = new CreateMusicBusiness(new MusicDB(), new IdGenerator(), new AlbumDB());
            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.BAND) {
                throw new UnauthorizedError("Only bands can create a music");
            }

            const bandId = authorizer.retrieveDataFromToken(token).userId;

            const title = req.body.title;
            const albumId = req.body.albumId;

            if(!title || !albumId){
                throw new InvalidInput("Missing input data")
            }

            await createMusicBusiness.execute(title, albumId, bandId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public getByText = async (req: Request, res: Response) => {
        try {
            const searchMusicBusiness = new SearchMusicBusiness(new MusicDB());

            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token) {
                throw new UnauthorizedError("Only listeners can search for musics by text");
            }

            const userRole = authorizer.retrieveDataFromToken(token).userRole;

            if (userRole !== UserRole.FREE_LISTENER && userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Only listeners can search for musics by text");
            }

            const text = req.query.text as string;
            const page = Number(req.query.page);

            if(!text || !page){
                throw new InvalidInput("Missing input data")
            }

            const result = await searchMusicBusiness.execute(text, page);

            res.status(200).send({ result });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public getDataById = async (req: Request, res: Response) => {
        try {
            const getMusicDataBusiness = new GetMusicDataBusiness(new MusicDB());

            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token) {
                throw new UnauthorizedError("Only listeners can search for musics by text");
            }

            const userRole = authorizer.retrieveDataFromToken(token).userRole;

            if (userRole !== UserRole.FREE_LISTENER && userRole !== UserRole.PREMIUM_LISTENER) {
                throw new UnauthorizedError("Only listeners can search for musics by text");
            }

            const id = req.query.id as string;

            if(!id){
                throw new InvalidInput("Missing input data")
            }

            const data = await getMusicDataBusiness.execute(id);

            res.status(200).send({ data });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public editName = async (req: Request, res: Response) => {
        try {
            const editMusicNameBusiness = new EditMusicNameBusiness(new MusicDB());

            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token) {
                throw new UnauthorizedError("Unauthorized: Only bands perform this request");
            }

            const tokenData = authorizer.retrieveDataFromToken(token);

            if (tokenData.userRole !== UserRole.BAND) {
                throw new UnauthorizedError("Unauthorized: Only bands perform this request");
            }
            
            const musicId = req.body.musicId;
            const newName = req.body.newName;
            
            if(!musicId || !newName){
                throw new InvalidInput("Missing input data")
            }
            
            await editMusicNameBusiness.execute(musicId, newName, tokenData.userId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public changeAlbum = async (req: Request, res: Response) => {
        try {
            const changeAlbumBusiness = new ChangeAlbumBusiness(new MusicDB(), new AlbumDB());

            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token) {
                throw new UnauthorizedError("Unauthorized: Only bands perform this request");
            }

            const tokenData = authorizer.retrieveDataFromToken(token);

            if (tokenData.userRole !== UserRole.BAND) {
                throw new UnauthorizedError("Unauthorized: Only bands perform this request");
            }
            
            const musicId = req.body.musicId;
            const albumId = req.body.albumId;
            
            if(!musicId || !albumId){
                throw new InvalidInput("Missing input data")
            }

            
            await changeAlbumBusiness.execute(musicId, albumId, tokenData.userId);

            res.status(200).send({ message: "OK" });

        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public deleteMusic = async (req: Request, res: Response) => {
        try {
            const deleteMusicBusiness = new DeleteMusicBusiness(new MusicDB());

            const authorizer = new Authorizer();
    
            const token = req.headers.authorization;
            
            if (!token) {
                throw new UnauthorizedError("Unauthorized: only bands perform this request");
            }

            const tokenData = authorizer.retrieveDataFromToken(token);

            if (tokenData.userRole !== UserRole.BAND) {
                throw new UnauthorizedError("Unauthorized: only bands perform this request");
            }
            
            const musicId = req.body.musicId;
            
            if(!musicId){
                throw new InvalidInput("Missing input data")
            }       
            
            await deleteMusicBusiness.execute(musicId, tokenData.userId);

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