import PlaylistDB from "../data/PlaylistDB";

export default class EditNameBusiness {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(playlistId: string, newName: string){
        await this.playlistDB.editName(playlistId, newName);
    }
}