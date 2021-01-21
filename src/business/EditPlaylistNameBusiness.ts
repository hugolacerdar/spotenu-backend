import PlaylistDB from "../data/PlaylistDB";
import UnauthorizedError from "../error/UnauthorizedError";
import { EditNameDTO, GetByIdDTO, IsUserFollowingDTO } from "../model/Playlist";

export default class EditPlaylistNameBusiness {
    constructor(private playlistDB: PlaylistDB){}

    public async execute(playlistId: string, newName: string, userId: string){

        const playlist = await this.playlistDB.getById(new GetByIdDTO(playlistId));

        const isUserFollowing = await this.playlistDB.isUserFollowing(new IsUserFollowingDTO(userId, playlistId));        
        
        if(userId !== playlist.getCreatorId() && !isUserFollowing){
            throw new UnauthorizedError("Unauthorized: premium members can only edit the name from their own playlists or playlists they follow")
        }

        await this.playlistDB.editName(new EditNameDTO(playlistId, newName));
    }
}