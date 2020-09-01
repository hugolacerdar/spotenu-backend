import { Router } from "express";
import UserController from "../controller/UserController";

const userRouter = Router();

userRouter.post("/signup", new UserController().signup);
userRouter.post("/signin", new UserController().signin);

export default userRouter;