import PlaylistDB from "../data/PlaylistDB";
import UserDB from "../data/UserDB";
import IdGenerator from "../services/IdGenerator";
import UnauthorizedError from "../error/UnauthorizedError";
import { UserRole } from "../model/User";

export default class AddMusicToPlaylistBusiness {
    constructor(public playlistDB: PlaylistDB){}

    public async execute(id_playlist: string, id_music: string){
        
        await this.playlistDB.addMusic(id_playlist, id_music);
    }
}