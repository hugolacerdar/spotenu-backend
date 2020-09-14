import PlaylistDB from "../data/PlaylistDB";

export default class GetUserPlaylists {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(userId: string, page: number){

        const result = await this.playlistDB.getUserPlaylists(userId, page);
        
        return result;
    }
}