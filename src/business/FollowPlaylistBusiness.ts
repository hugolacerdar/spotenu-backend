import UserDB from "../data/UserDB";
import PlaylistDB from "../data/PlaylistDB";
import InvalidInputError from "../error/InvalidInput";
import Playlist, { Permission } from "../model/Playlist";
import InvalidInput from "../error/InvalidInput";
import NotFoundError from "../error/NotFoundError";

export default class FollowPlaylistBusiness {
    constructor(private userDB: UserDB, private playlistDB: PlaylistDB){}

    public async execute(playlistId: string, userId: string) {
        const playlist = await this.playlistDB.getById(playlistId);

        if(!playlist){
            throw new NotFoundError("Playlist not found")
        }
        if(playlist.getPermission() !== Permission.PUBLIC){
            throw new InvalidInput("Can't follow a private playlist")
        }

        if(await this.userDB.isAlreadyFollowing(playlistId, userId)){
            throw new InvalidInputError("User already follows the selected playlist")
        }

        if(userId === playlist.getCreatorId()){
            throw new InvalidInputError("User can't follow it's own playlists")
        }

        await this.userDB.followPlaylist(playlistId, userId);
    }
}