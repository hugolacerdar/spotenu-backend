import PlaylistDB from "../data/PlaylistDB";

export default class EditPlaylistNameBusiness {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(playlistId: string, newName: string){
        await this.playlistDB.editName(playlistId, newName);
    }
}