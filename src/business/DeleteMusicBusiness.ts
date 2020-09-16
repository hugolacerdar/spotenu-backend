import MusicDB from "../data/MusicDB";

export default class DeleteMusicBusiness {
    constructor(public musicDB: MusicDB){}

    public async execute(musicId: string) {
        await this.musicDB.delete(musicId);
    }
}