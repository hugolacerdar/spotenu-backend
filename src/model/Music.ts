export default class Music {

    constructor(
        private musicId: string,
        private title: string,
        private albumId: string,
        private albumTitle: string,
        private bandId: string,
        private bandName: string,
        private genresId: string[],
        private genresName: string[]
    ){}

    public getId(): string {
        return this.musicId;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAlbumId(): string {
        return this.albumId;
    }

    public getAlbumTitle(): string {
        return this.albumTitle;
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

    public static toMusic(data?: any): Music | undefined { 
        return(data && 
            new Music(data.id,
                data.title,
                data.albumId,
                data.albumTitle,
                data.bandId,
                data.bandName,
                data.genresÍd,
                data.genresName
                ));
    }
};

export class GetMusicByTextOutput {
    constructor(
        public musicId: string,
        public title: string,
        ){}
};

export class CreateMusicDTO {
    constructor(
    public musicId: string,
    public title: string,
    public albumId: string
    ){}
};

export class GetMusicByTextDTO {
    constructor(
    public text: string,
    public page: number
    ){}
};

export class GetMusicDataByIdDTO {
    constructor(
    public id: string
    ){}
};

export class EditMusicNameDTO {
    constructor(
    public id: string,
    public newName: string
    ){}
};

export class ChangeMusicAlbumDTO {
    constructor(
        public musicId: string,
        public albumId: string
    ){}
}

export class DeleteMusicDTO {
    constructor(
        public id: string,
    ){}
}
