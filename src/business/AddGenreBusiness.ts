import MusicGenreDB from "../data/MusicGenreDB";
import IdGenerator from "../services/IdGenerator";

export default class AddGenre {
    constructor(
        private musicGenreDB: MusicGenreDB,
        private idGenerator: IdGenerator
        ){};

        public async execute(genre: string){
            const id: string =  this.idGenerator.generate();
            
            await this.musicGenreDB.addGenre(id, genre);
        }
}