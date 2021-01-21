import MusicDB from "../data/MusicDB";
import { GetMusicDataByIdDTO, EditMusicNameDTO } from "../model/Music";
import NotFoundError from "../error/NotFoundError";
import UnauthorizedError from "../error/UnauthorizedError";

export default class EditMusicNameBusiness {
    constructor(private musicDB: MusicDB){}

    public async execute(musicId: string, newName: string, userId: string){

        const musicData = await this.musicDB.getMusicDataById(new GetMusicDataByIdDTO(musicId));


        if(!musicData){
            throw new NotFoundError("Invalid music id");
        }

        if(musicData.getBandId() !== userId){
            throw new UnauthorizedError("Unauthorized: only the band associated with the music can edit it's name")
        }

        await this.musicDB.editName(new EditMusicNameDTO(musicId, newName));
    }
}