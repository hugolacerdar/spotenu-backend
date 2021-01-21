import InvalidInputError from "../error/InvalidInput";

export default class Playlist {

    constructor(
        private id: string,
        private name: string,
        private creatorId: string,
        private permission: Permission
    ){}

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCreatorId(): string {
        return this.creatorId;
    }

    public getPermission(): Permission {
        return this.permission;
    }

    public static toPlaylist(data?: any): Playlist | undefined { 
        return(data && 
            new Playlist(data.id,
                data.name,
                data.creatorId,
                data.permission
                ));
    }

    public static toPermission(data?: string): Permission{
        switch(data){
            case "PUBLIC":
                return Permission.PUBLIC;
            case "PRIVATE":
                return Permission.PRIVATE;
            default:
                throw new InvalidInputError("Invalid User Role")
        }
    }
};

export enum Permission {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export class GetByIdDTO {
    constructor(public playlistId: string){}
}

export class CreateDTO {
    constructor(public playlistId: string,
                public name: string,
                public creatorId: string){}
}

export class AddMusicDTO {
    constructor(public playlistId: string,
                public musicId: string){}
}

export class RemoveMusicDTO {
    constructor(public playlistId: string,
                public musicId: string){}
}

export class IsMusicAlreadyInDTO {
    constructor(public playlistId: string,
                public musicId: string){}
}

export class IsUserFollowingDTO {
    constructor(public playlistId: string,
                public userId: string){}
}

export class GetByUserIdDTO {
    constructor(public userId: string,
                public page: number){}
}

export class TurnPlaylistPublicDTO {
    constructor(public playlistId: string){}
}

export class EditNameDTO {
    constructor(public playlistId: string,
                public newName: string){}
}