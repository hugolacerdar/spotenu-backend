import PlaylistDB from "../data/PlaylistDB";

export default class TurnPlaylistPublicBusiness {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(playlistId: string){

        await this.playlistDB.turnPlaylistPublic(playlistId);
    }
}