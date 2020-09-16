import MusicDB from "../data/MusicDB";

export default class EditMusicNameBusiness {
    constructor(public musicDB: MusicDB){}

    public async execute(musicId: string, newName: string){
        await this.musicDB.editName(musicId, newName);
    }
}