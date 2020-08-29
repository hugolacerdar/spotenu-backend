import BaseError from "./base/BaseError";

export default class SetupError extends BaseError {
    constructor(public message: string = "Error on project setup"){
        super(message, 500);
    }
}