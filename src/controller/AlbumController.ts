import { Request, Response } from "express";
import AlbumDB from "../data/AlbumDB";
import CreateAlbumBusiness from "../business/CreateAlbumBusiness";
import DeleteAlbumBusiness from "../business/DeleteAlbumBusiness";
import Authorizer from "../services/Authorizer";
import IdGenerator from "../services/IdGenerator";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import { UserRole } from "../model/User";
import BaseDB from "../data/base/BaseDB";
import NotFoundError from "../error/NotFoundError";

export default class AlbumController {
    public createAlbum = async (req: Request, res: Response) => {
        try {
            const createAlbumBusiness = new CreateAlbumBusiness(new AlbumDB(), new IdGenerator());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;

            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.BAND) {
                throw new UnauthorizedError("Only bands can create an album");
            }

            const bandId = authorizer.retrieveDataFromToken(token).userId;

            const title = req.body.title;
            const genresId = req.body.genres;

            if (!title || !genresId) {
                throw new InvalidInput("Missing input data")
            }


            await createAlbumBusiness.execute(title, bandId, genresId);

            res.status(200).send({ message: "OK" });

        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public deleteAlbum = async (req: Request, res: Response) => {
        try {
            const deleteAlbumBusiness = new DeleteAlbumBusiness(new AlbumDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;

            if (!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.BAND) {
                throw new UnauthorizedError("Only bands can delete albums");
            }

            const albumId = req.body.albumId;

            if (!albumId) {
                throw new InvalidInput("Missing input data")
            }

            const bandId = authorizer.retrieveDataFromToken(token).userId;
            const albumData = await deleteAlbumBusiness.albumDB.getById(albumId);

            if(!albumData){
                throw new NotFoundError("Album not found");
            }

            if(bandId !== albumData.bandId){
                throw new UnauthorizedError("Unauthorized: bands can only delete their own albums");
            }

            await deleteAlbumBusiness.execute(albumId);

            res.status(200).send({ message: "OK" });

        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }
}