import PlaylistDB from "../data/PlaylistDB";
import InvalidInputError from "../error/InvalidInput";
import UnauthorizedError from "../error/UnauthorizedError";
import Playlist, { Permission, AddMusicDTO,GetByIdDTO, IsUserFollowingDTO, IsMusicAlreadyInDTO } from "../model/Playlist";


export default class AddMusicToPlaylistBusiness {
    constructor(private playlistDB: PlaylistDB){}

    public async execute(playlistId: string, musicId: string, userId: string){

        const playlist = await this.playlistDB.getById(new GetByIdDTO(playlistId));
        const isUserFollowing = await this.playlistDB.isUserFollowing(new IsUserFollowingDTO(userId, playlistId));


        if(userId !== playlist.getCreatorId() && !isUserFollowing){
            throw new UnauthorizedError("Unauthorized: premium members can only add musics to their own playlists or playlists they follow")
        }

        
        if(await this.playlistDB.isMusicAlreadyIn(new IsMusicAlreadyInDTO(musicId, playlistId))){
            throw new InvalidInputError("Selected music is already present at this playlist");
        }

        await this.playlistDB.addMusic(new AddMusicDTO(playlistId, musicId));
    }
}