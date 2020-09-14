import PlaylistDB from "../data/PlaylistDB";
import InvalidInputError from "../error/InvalidInput";

export default class AddMusicToPlaylistBusiness {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(id_playlist: string, id_music: string){
        
        if(!await this.playlistDB.isMusicAlreadyIn(id_music, id_playlist)){
            throw new InvalidInputError("Selected music is not present at this playlist");
        }

        await this.playlistDB.removeMusic(id_playlist, id_music);
    }
}