import MusicDB from "../data/MusicDB";
import AlbumDB from "../data/AlbumDB";
import { GetMusicDataByIdDTO, EditMusicNameDTO, ChangeMusicAlbumDTO } from "../model/Music";
import NotFoundError from "../error/NotFoundError";
import UnauthorizedError from "../error/UnauthorizedError";
import InvalidInput from "../error/InvalidInput";
import { GetAlbumByIdDTO } from "../model/Album";

export default class ChangeAlbumBusiness {
    constructor(private musicDB: MusicDB, private AlbumDB: AlbumDB){}

    public async execute(musicId: string, albumId: string, userId: string){
        const musicData = await this.musicDB.getMusicDataById(new GetMusicDataByIdDTO(musicId));

        if(!musicData){
            throw new NotFoundError("Invalid music id");
        }

        if(musicData.getBandId() !== userId){
            throw new UnauthorizedError("Unauthorized: only the band associated with the music can edit it's name")
        }            

        if(musicData.getAlbumId() === albumId){
            throw new InvalidInput("Invalid input: the music is currently on the informed album")
        }

        const albumData = await this.AlbumDB.getById(new GetAlbumByIdDTO(albumId));

        if(!albumData){
            throw new NotFoundError("Invalid album id");
        }
        
        if(albumData.getBandId() !== userId){
            throw new UnauthorizedError("Unauthorized: can only insert musics into albums associated with the same band id")
        }


        await this.musicDB.changeAlbum(new ChangeMusicAlbumDTO(musicId, albumId));
    }
}