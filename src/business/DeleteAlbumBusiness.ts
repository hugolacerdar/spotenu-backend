import AlbumDB from "../data/AlbumDB";

export default class DeleteAlbumBusiness {
    constructor(public albumDB: AlbumDB){}

    public async execute(albumId: string){
        await this.albumDB.delete(albumId);
    }
}