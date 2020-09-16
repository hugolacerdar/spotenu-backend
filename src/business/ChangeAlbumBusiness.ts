import MusicDB from "../data/MusicDB";
import AlbumDB from "../data/AlbumDB";

export default class ChangeAlbumBusiness {
    constructor(public musicDB: MusicDB, public AlbumDB: AlbumDB){}

    public async execute(musicId: string, albumId: string){
        await this.musicDB.changeAlbum(musicId, albumId);
    }
}