import AlbumDB from "../data/AlbumDB";
import NotFoundError from "../error/NotFoundError";
import UnauthorizedError from "../error/UnauthorizedError";
import { DeleteAlbumDTO, GetAlbumByIdDTO } from "../model/Album";

export default class DeleteAlbumBusiness {
    constructor(private albumDB: AlbumDB){}

    public async execute(albumId: string, bandId: string){

        const albumData = await this.albumDB.getById(new GetAlbumByIdDTO(albumId));

        if(!albumData){
            throw new NotFoundError("Album not found");
        }

        if(bandId !== albumData.getBandId()){
            throw new UnauthorizedError("Unauthorized: bands can only delete their own albums");
        }
        
        await this.albumDB.delete(new DeleteAlbumDTO(albumId));
    }
}