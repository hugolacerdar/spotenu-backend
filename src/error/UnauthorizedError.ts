import BaseError from "./base/BaseError";

export default class UnauthorizedError extends BaseError {
    constructor(public message: string){
        super(message, 403);
    }
}