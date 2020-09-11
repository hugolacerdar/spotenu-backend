import MusicDB from "../data/MusicDB";

export default class GetMusicData {
    constructor(private musicDB: MusicDB){}

    public async execute(id: string) {

        const result = await this.musicDB.getMusicDataById(id);

        return result;
    }
}