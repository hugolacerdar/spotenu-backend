import MusicGenreDB from "../data/MusicGenreDB";

export default class GetGenres {
    constructor(
        private musicGenreDB: MusicGenreDB,
        ){};

        public async execute(){
            const genres = await this.musicGenreDB.getAll();

            return genres;
        }
}