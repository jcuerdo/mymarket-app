import { Photo } from './photo';

export class Market {

    private id: number;
    private name: string;
    private description: string;
    private date: string;
    private lat: string;
    private lng: string;
    private photos: Photo[] = [];


	constructor() {
		this.photos = [];
	}
    

    public getId(): number {
		return this.id;
	}

	public setId(value: number) {
		this.id = value;
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

	public addPhoto(photo: Photo, index: number ) {
		this.photos[index] = photo;
	}
}