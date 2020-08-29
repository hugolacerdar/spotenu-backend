import BaseError from "./base/BaseError";

export default class NotFoundError extends BaseError {
    constructor(public message: string){
        super(message, 404);
    }
}