import PlaylistDB from "../data/PlaylistDB";
import { GetByUserIdDTO } from "../model/Playlist";

export default class GetPlaylistsByUserIdBusiness {
    constructor(private playlistDB: PlaylistDB){}

    public async execute(userId: string, page: number){

        const result = await this.playlistDB.getPlaylistsByUserId(new GetByUserIdDTO(userId, page));
        
        return result;
    }
}