export default abstract class BaseError extends Error {
    constructor(
        public message: string,
        public customErrorCode: number
        ){
            super(message);
        }
}