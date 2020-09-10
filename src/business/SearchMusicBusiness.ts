import MusicDB from "../data/MusicDB";

export default class SearchMusicBusiness {
    constructor(private musicDB: MusicDB){}

    public async execute(text: string, page: number) {

        const result = await this.musicDB.getMusicsByText(text, page);

        return result;
    }
}