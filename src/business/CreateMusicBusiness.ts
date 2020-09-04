import MusicDB from "../data/MusicDB";
import IdGenerator from "../services/IdGenerator";

export default class CreateMusicBusiness {
    constructor(private musicDB: MusicDB, private idGenerator: IdGenerator){}

    public async execute(title: string, id_album: string) {

        const id = this.idGenerator.generate();

        await this.musicDB.create(id, title, id_album);
    }
}