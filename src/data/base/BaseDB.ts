import SetupError from "../../error/SetupError";
import knex from "knex";

export default abstract class BaseDB {
    protected tableNames = {
        users: "sptn_user",
        description: "sptn_band_desc",
        musicGenres: "sptn_music_genre",
        musicAlbum: "sptn_music_album",
        albumGenre: "sptn_album_genre",
        musics: "sptn_music",
        playlists: "sptn_playlist",
        playlistMusic: "sptn_playlist_music",
        playlistUser: "sptn_playlist_user"
    }

    private validateSetupData() {
        if (
          !process.env.DB_HOST ||
          !process.env.DB_USER ||
          !process.env.DB_PASSWORD ||
          !process.env.DB_NAME
        ) {
          throw new SetupError(
            "Missing database credentials. Did you remember to create a .env file?"
          );
        }
      }

    private static connection: knex | null = null;

    protected getConnection(): knex {
        this.validateSetupData();
        if(!BaseDB.connection){
            BaseDB.connection = knex({
                client: "mysql",
                connection: {
                    host: process.env.DB_HOST,
                    port: 3306,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME
                }
            })
        }
        
        return BaseDB.connection;
    }
    
    public static async destroyConnection() {
        if(BaseDB.connection){
            await BaseDB.connection.destroy();
            BaseDB.connection = null;
        }
    }
}