import PlaylistDB from "../data/PlaylistDB";
import InvalidInput from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import { GetByIdDTO, Permission, TurnPlaylistPublicDTO } from "../model/Playlist";

export default class TurnPlaylistPublicBusiness {
    constructor(private playlistDB: PlaylistDB){}

    public async execute(playlistId: string, userId: string){

        const playlist = await this.playlistDB.getById(new GetByIdDTO(playlistId));

        if(!playlist){
            throw new InvalidInput("Invalid input: no playlist matching the input id")
        }

        if(userId !== playlist.getCreatorId()){
            throw new UnauthorizedError("Unauthorized: premium members can only turn their own playlists into public")
        }

        if(playlist.getPermission() === Permission.PUBLIC){
            throw new InvalidInput("Playlist is already public")
        }

        await this.playlistDB.turnPlaylistPublic(new TurnPlaylistPublicDTO(playlistId));
    }
}