import { Request, Response } from "express";
import BaseDB from "../data/base/BaseDB";
import UserDB from "../data/UserDB";
import SignupBusiness from "../business/SignupBusiness";
import UpgradeListenerBusiness from "../business/UpgradeListenerBusiness";
import Cypher from "../services/Cypher";
import Authorizer from "../services/Authorizer";
import IdGenerator from "../services/IdGenerator";
import InvalidInputError from "../error/InvalidInput";
import User, { UserRole } from "../model/User";
import UnauthorizedError from "../error/UnauthorizedError";
import SigninBusiness from "../business/SigninBusiness";
import GetBandsBusiness from "../business/GetBandsBusiness";
import ApproveBandBusiness from "../business/ApproveBandBusiness";
import EditNameBusiness from "../business/EditUserNameBusiness";
import FollowPlaylistBusiness from "../business/FollowPlaylistBusiness";
import BlockUserBusiness from "../business/BlockUserBusiness";
import InvalidInput from "../error/InvalidInput";
import PlaylistDB from "../data/PlaylistDB";

export default class UserController {
    public signup = async (req: Request, res: Response) => {
        try {
            const signupBusiness = new SignupBusiness(
                new UserDB(),
                new Cypher(),
                new IdGenerator()
            );

            let input: any = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                role: req.body.role,
                password: req.body.password,
                isApproved: true,
                isBlocked: false
            }

            if (!input.name || !input.email || !input.username || !input.role || !input.password) {
                throw new InvalidInputError("Missing data");
            }

            if (input.role === "BAND" && !req.body.description){
                throw new InvalidInputError("Missing band description");
            } else if(input.role === "BAND" && req.body.description){
                input = {...input, isApproved: false, description: req.body.description};
            }

            if (input.role !== "ADMIN" && input.password.length < 6){
                throw new InvalidInputError("The password is too short, the mandatory minimum length is 6")
            }

            if (input.role === "ADMIN" && input.password.length < 10){
                throw new InvalidInputError("The password is too short, the mandatory admin minimum length is 10")
            }
           
            const authorizer = new Authorizer();

            if(input.role === UserRole.ADMIN && req.headers.authorization){
                const tokenData = authorizer.retrieveDataFromToken(req.headers.authorization);
                
                if(tokenData.userRole !== UserRole.ADMIN){
                    throw new UnauthorizedError("Admin level required to create another admin account");
                }
            }else if(input.role === UserRole.ADMIN && !req.headers.authorization){
                throw new UnauthorizedError("Admin level required to create another admin account");
            }

            const user = await signupBusiness.execute(input);

            if(user.getRole() !== UserRole.BAND){
                const token = authorizer.generateToken({    
                userId: user.getId(),
                userRole: user.getRole()
                });
                res.status(200).send({ token });
            }

            res.status(200).send({ message: "OK" });
        } catch(err){
            res.status(err.customErrorCode || 400).send({
                message: err.message,
            });
        } finally{
            await BaseDB.destroyConnection();
        }
    }

    public signin = async(req: Request, res: Response) => {
        try{
            const signinBusiness = new SigninBusiness(new UserDB(), new Cypher());

            const input = {
                credential: req.body.credential,
                password: req.body.password
            }

            if(!input.credential || !input.password){
                throw new InvalidInputError("Missing credentials")
            }

            const user = await signinBusiness.execute(input);
            
            const authorizer = new Authorizer();
            const token = authorizer.generateToken({
                userId: user.getId(),
                userRole: user.getRole()
            });

            res.status(200).send({ token });
        } catch(err){
            res.status(err.customErrorCode || 400).send({
                message: err.message
            });
        } finally{
            await BaseDB.destroyConnection();
        }
    }

    public getBands = async(req: Request, res: Response) => {
        try {
            const getBandsBusiness = new GetBandsBusiness(new UserDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;

            if(!token || authorizer.retrieveDataFromToken(token).userRole !== UserRole.ADMIN){
                throw new UnauthorizedError("Only admins can perform this request");
            }

            const bands = await getBandsBusiness.execute();

            res.status(200).send({ bands });
        } catch(err) {
            res.status(err.customErrorCode || 400).send({ 
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public approveBand = async(req: Request, res: Response) => {
        try {
            const approveBandBusiness = new ApproveBandBusiness(new UserDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            const id = req.body.id;

            if(!token){
                throw new UnauthorizedError("Missing token: only admins can perform this request");
            }

            if(authorizer.retrieveDataFromToken(token).userRole !== UserRole.ADMIN){
                throw new UnauthorizedError("Invalid role: only admins can perform this request");
            }

            if(!id){
                throw new InvalidInput("Missing id");
            }

            await approveBandBusiness.execute(id);

            res.status(200).send({ message: "OK" });
        } catch(err) {
            res.status(err.customErrorCode || 400).send({ 
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public upgradeListener = async(req: Request, res: Response) => {
        try {
            const upgradeListenerBusiness = new UpgradeListenerBusiness(new UserDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            const id = req.body.id;

            if(!token){
                throw new UnauthorizedError("Missing token: only admins can perform this request");
            }

            if(authorizer.retrieveDataFromToken(token).userRole !== UserRole.ADMIN){
                throw new UnauthorizedError("Invalid user role: only admins can perform this request");
            }

            if(!id){
                throw new InvalidInput("Missing id");
            }

            await upgradeListenerBusiness.execute(id);

            res.status(200).send({ message: "OK" });
        } catch(err) {
            res.status(err.customErrorCode || 400).send({ 
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public followPlaylist = async(req: Request, res: Response) => {
        try {
            const followPlaylistBusiness = new FollowPlaylistBusiness(new UserDB(), new PlaylistDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            const playlistId = req.body.playlistId;

            if(!token){
                throw new UnauthorizedError("Missing token: only listeners can perform this request");
            }

            const tokenData = authorizer.retrieveDataFromToken(token)

            if(tokenData.userRole !== UserRole.FREE_LISTENER && tokenData.userRole !== UserRole.PREMIUM_LISTENER){
                throw new UnauthorizedError("Invalid user role: only listeners can perform this request");
            }

            if(!playlistId){
                throw new InvalidInput("Missing playlistId");
            }

            const userId = tokenData.userId;

            await followPlaylistBusiness.execute(playlistId, userId);

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
            const editNameBusiness = new EditNameBusiness(new UserDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            const newName = req.body.newName;

            if(!token){
                throw new UnauthorizedError("Missing token: only listeners can perform this request");
            }

            const tokenData = authorizer.retrieveDataFromToken(token)

            if(!newName){
                throw new InvalidInput("Missing new name value");
            }

            const userId = tokenData.userId;

            await editNameBusiness.execute(userId, newName);

            res.status(200).send({ message: "OK" });
        } catch(err) {
            res.status(err.customErrorCode || 400).send({ 
                message: err.message
            })
        } finally {
            BaseDB.destroyConnection();
        }
    }

    public blockUser = async(req: Request, res: Response) => {
        try {
            const blockUserBusiness = new BlockUserBusiness(new UserDB());
            const authorizer = new Authorizer();

            const token = req.headers.authorization;
            const userId = req.body.userId;

            if(!token){
                throw new UnauthorizedError("Missing token: only admins can perform this request");
            }

            if(authorizer.retrieveDataFromToken(token).userRole !== UserRole.ADMIN){
                throw new UnauthorizedError("Invalid role: only admins can perform this request");
            }

            if(!userId){
                throw new InvalidInput("Missing id");
            }

            await blockUserBusiness.execute(userId);

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
