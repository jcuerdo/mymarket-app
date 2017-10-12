import { Photo } from './photo';

export class Market {

    private id: number;
    private name: string;
    private description: string;
    private date: string;
    private lat: string;
    private lng: string;
    private photos: Photo[] = [];


	constructor($id: number, $name: string, $description: string, $date: string, $lat: string, $lng: string, $photos: Photo[] ) {
		this.id = $id;
		this.name = $name;
		this.description = $description;
		this.date = $date;
		this.lat = $lat;
		this.lng = $lng;
		this.photos = $photos;
	}
    

    public get $id(): number {
		return this.id;
	}

	public set $id(value: number) {
		this.id = value;
	}
    
    public get $name(): string {
        return this.name;
    }

    public set $name(value: string) {
        this.name = value;
    }


    public get $description(): string {
        return this.description;
    }

    public set $description(value: string) {
        this.description = value;
    }

	public get $date(): string {
		return this.date;
	}

	public set $date(value: string) {
		this.date = value;
	}

	public get $lat(): string {
		return this.lat;
	}

	public set $lat(value: string) {
		this.lat = value;
	}

	public get $lng(): string {
		return this.lng;
	}

	public set $lng(value: string) {
		this.lng = value;
	}


	public get $photos(): any  {
		return this.photos;
	}

	public addPhoto(photo: Photo, index: number ) {
		this.photos.push(photo);
	}
    


    

}