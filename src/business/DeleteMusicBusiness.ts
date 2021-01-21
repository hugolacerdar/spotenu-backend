import MusicDB from "../data/MusicDB";
import NotFoundError from "../error/NotFoundError";
import UnauthorizedError from "../error/UnauthorizedError";
import { DeleteMusicDTO, GetMusicDataByIdDTO } from "../model/Music";

export default class DeleteMusicBusiness {
    constructor(private musicDB: MusicDB){}

    public async execute(musicId: string, bandId: string) {


        const musicData = await this.musicDB.getMusicDataById(new GetMusicDataByIdDTO(musicId));

        if(!musicData){
            throw new NotFoundError("Invalid music id");
        }

        if(musicData.getBandId() !== bandId){
            throw new UnauthorizedError("Unauthorized: only the band associated with the music can delete it")
        }     
        
        await this.musicDB.delete(new DeleteMusicDTO(musicId));
    }
}