export default class Album {

    constructor(
        private albumId: string,
        private name: string,
        private bandId: string,
        private bandName: string,
        private genresId: string[],
        private genresName: string[]
    ){}

    public getId(): string {
        return this.albumId;
    }

    public getName(): string {
        return this.name;
    }

    public getBandId(): string {
        return this.bandId;
    }

    public getBandName(): string {
        return this.bandName;
    }

    public getGenresId(): string[] {
        return this.genresId;
    }

    public getGenresName(): string[] {
        return this.genresName;
    }

    public static toAlbum(data?: any): Album | undefined { 
        return(data && 
            new Album(data.id,
                data.name,
                data.bandId,
                data.bandName,
                data.genresÍd,
                data.genresName
                ));
    }
};

export class CreateAlbumDTO {
    constructor(
    public albumId: string,
    public name: string,
    public bandId: string,
    public genresId: string[]
    ){}
};

export class GetAlbumByIdDTO {
    constructor(
        public albumId: string
        ){}
};

export class DeleteAlbumDTO {
    constructor(
        public id: string,
    ){}
}
