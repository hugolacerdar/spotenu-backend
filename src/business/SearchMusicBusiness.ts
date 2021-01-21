import MusicDB from "../data/MusicDB";
import { GetMusicByTextDTO } from "../model/Music";

export default class SearchMusicBusiness {
    constructor(private musicDB: MusicDB){}

    public async execute(text: string, page: number) {

        const result = await this.musicDB.getMusicsByText(new GetMusicByTextDTO(text, page));

        return result;
    }
}