import PlaylistDB from "../data/PlaylistDB";

export default class GetPlaylistsByUserIdBusiness {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(userId: string, page: number){

        const result = await this.playlistDB.getPlaylistsByUserId(userId, page);
        
        return result;
    }
}