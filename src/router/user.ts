import { Router } from "express";
import UserController from "../controller/UserController";

const userRouter = Router();

userRouter.post("/signup", new UserController().signup);
userRouter.post("/signin", new UserController().signin);
userRouter.get("/bands", new UserController().getBands);
userRouter.put("/approve_band", new UserController().approveBand);

export default userRouter;