import AlbumDB from "../data/AlbumDB";
import { CreateAlbumDTO } from "../model/Album";
import IdGenerator from "../services/IdGenerator";

export default class CreateAlbumBusiness {
    constructor(private albumDB: AlbumDB, private idGenerator: IdGenerator){}

    public async execute(title: string, id_band: string, genresId: string[]) {

        const id = this.idGenerator.generate();

        await this.albumDB.create(new CreateAlbumDTO(id, title, id_band, genresId));
    }
}