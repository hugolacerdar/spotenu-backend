import PlaylistDB from "../data/PlaylistDB";
import UserDB from "../data/UserDB";
import IdGenerator from "../services/IdGenerator";
import UnauthorizedError from "../error/UnauthorizedError";
import { UserRole } from "../model/User";
import { CreateDTO } from "../model/Playlist";

export default class CreatePlaylistBusiness {
    constructor(private playlistDB: PlaylistDB, private userDB: UserDB, private idGenerator: IdGenerator){}

    public async execute(name: string, id_creator: string){
        
        const user = await this.userDB.getUserById(id_creator);

        const userRole = user.getRole();

        if(userRole !== UserRole.PREMIUM_LISTENER){
            throw new UnauthorizedError("Unauthorized: only premium listeners can create playlists");
        }

        const id = this.idGenerator.generate();

        await this.playlistDB.create(new CreateDTO(id, name, id_creator));
    }
}