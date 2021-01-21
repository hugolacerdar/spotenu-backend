import MusicDB from "../data/MusicDB";
import { GetMusicDataByIdDTO } from "../model/Music";

export default class GetMusicData {
    constructor(private musicDB: MusicDB){}

    public async execute(id: string) {

        const result = await this.musicDB.getMusicDataById(new GetMusicDataByIdDTO(id));

        return result;
    }
}