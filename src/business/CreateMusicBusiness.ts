import AlbumDB from "../data/AlbumDB";
import MusicDB from "../data/MusicDB";
import NotFoundError from "../error/NotFoundError";
import UnauthorizedError from "../error/UnauthorizedError";
import { GetAlbumByIdDTO } from "../model/Album";
import { CreateMusicDTO } from "../model/Music";
import IdGenerator from "../services/IdGenerator";

export default class CreateMusicBusiness {
    constructor(private musicDB: MusicDB, private idGenerator: IdGenerator, private albumDB: AlbumDB){}

    public async execute(title: string, albumId: string, bandId: string) {

        const albumData = await this.albumDB.getById(new GetAlbumByIdDTO(albumId));

        if(!albumData){
            throw new NotFoundError("Album not found");
        }

        if(bandId !== albumData.getBandId()){
            throw new UnauthorizedError("Bands can only add music to their own albums")
        }

        const id = this.idGenerator.generate();

        await this.musicDB.create(new CreateMusicDTO(id, title, albumId));
    }
}