import { Photo } from './photo';
import { User } from './user';

export class Market {

	private id: number;
	private owner: User;
    private name: string;
    private description: string;
    private date: string;
    private lat: string;
    private lng: string;
	private photos: Photo[] = [];
	private type: string;
	private flexible: boolean;
	private place: string;

	constructor() {
		this.photos = [];
		this.owner = null;
	}

    public getId(): number {
		return this.id;
	}

	public setId(value: number) {
		this.id = value;
	}

	public getOwner(): User {
		return this.owner;
	}

	public setOwner(value: User) {
		this.owner = value;
	}
    
    public getName(): string {
        return this.name;
    }

    public setName(value: string) {
        this.name = value;
    }


    public getDescription(): string {
        return this.description;
    }

    public setDescription(value: string) {
        this.description = value;
    }

	public getDate(): string {
		return this.date;
	}

	public setDate(value: string) {
		this.date = value;
	}

	public getLat(): string {
		return this.lat;
	}

	public setLat(value: string) {
		this.lat = value;
	}

	public getLng(): string {
		return this.lng;
	}

	public setLng(value: string) {
		this.lng = value;
	}

	public getPhotos(): Photo[]  {
		return this.photos;
	}

	public addPhoto(photo: Photo, index: number) {
        this.photos[index] = photo;        
    }

    public clearPhotos() : void{
        this.photos = [];
	}
	
	public getType(): string {
		return this.type;
	}

	public setType(value: string) {
		this.type = value;
	}

	public getPlace(): string {
		return this.place;
	}

	public setPlace(value: string) {
		this.place = value;
	}

	public getFlexible(): boolean {
		return this.flexible;
	}

	public setFlexible(value: boolean) {
		this.flexible = value;
	}
}