import BaseDB from "./base/BaseDB";

export default class MusicDB extends BaseDB {

    public async create(id_music: string, title: string, id_album: string): Promise<void>{
        await this.getConnection().raw(`
            INSERT ${this.tableNames.musics}() VALUES("${id_music}", "${title}", "${id_album}");
        `);
    }
}