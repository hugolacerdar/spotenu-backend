import BaseDB from "./base/BaseDB";

export default class MusicGenreDB extends BaseDB {
    
    public async addGenre(id: string, genre: string): Promise<void> {
        await this.getConnection().raw(`
            INSERT ${this.tableNames.musicGenres}() VALUES("${id}", "${genre}");
        `);
    }
    
    public async getAll(): Promise<any> {
        const genresRaw: any = await this.getConnection().raw(`
            SELECT id_genre AS id, name 
            FROM ${this.tableNames.musicGenres};
        `);

        const genresOutput: any[] = genresRaw[0].map((genre: any) => {
            return {
                id: genre.id,
                name: genre.name
            };
        });

        return genresOutput;
    }; 
}