import BaseError from "./base/BaseError";

export default class InvalidInput extends BaseError {
    constructor(public message: string){
        super(message, 422);
    }
}