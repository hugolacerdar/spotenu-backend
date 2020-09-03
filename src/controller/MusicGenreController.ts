import { Request, Response } from "express";
import AddGenreBusiness from "../business/AddGenreBusiness";
import GetGenresBusiness from "../business/GetGenresBusiness";
import MusicGenreDB from "../data/MusicGenreDB";
import IdGenerator from "../services/IdGenerator";
import Authorizer from "../services/Authorizer";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import { UserRole } from "../model/User";
import BaseDB from "../data/base/BaseDB";

export default class MusicGenreController {
    public addGenre = async(req: Request, res: Response) => {
        try {
            const addGenreBusiness = new AddGenreBusiness(new MusicGenreDB(), new IdGenerator());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;

            if(!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.ADMIN){
                throw new UnauthorizedError("Only admins can perform this request");
            }

            const genre: string = req.body.genre;

            await addGenreBusiness.execute(genre);

            res.status(200).send({ message: "OK" });
        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public getGenres = async(req: Request, res: Response) => {
        try {
            const getGenresBusiness = new GetGenresBusiness(new MusicGenreDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;

            if(!token){
                throw new UnauthorizedError("Only admins or bands can perform this request");
            }

            if(authorizer.retrieveDataFromToken(token).userRole === "FREE LISTENER" || authorizer.retrieveDataFromToken(token).userRole === "PREMIUM LISTENER"){
                throw new UnauthorizedError("Listeners can not perform this request");
            }

            const genres = await getGenresBusiness.execute();

            res.status(200).send({ genres });
        } catch(err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }
}