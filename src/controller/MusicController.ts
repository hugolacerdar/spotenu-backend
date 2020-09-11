import { Request, Response } from "express";
import MusicDB from "../data/MusicDB";
import AlbumDB from "../data/AlbumDB";
import CreateMusicBusiness from "../business/CreateMusicBusiness";
import SearchMusicBusiness from "../business/SearchMusicBusiness";
import GetMusicDataBusiness from "../business/GetMusicDataBusiness";
import Authorizer from "../services/Authorizer";
import IdGenerator from "../services/IdGenerator";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import { UserRole } from "../model/User";
import BaseDB from "../data/base/BaseDB";

export default class MusicController {
    public createMusic= async (req: Request, res: Response) => {
        try {
            const createMusicBusiness = new CreateMusicBusiness(new MusicDB(), new IdGenerator());
            const authorizer = new Authorizer();
            const albumDB = new AlbumDB();
    
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

            if(!(await albumDB.isBandAllowed(bandId, albumId))){
                throw new UnauthorizedError("Bands can only add music to their own albums")
            }

            await createMusicBusiness.execute(title, albumId);

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
}