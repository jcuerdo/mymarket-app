

export class Photo {
    private id: number;
    private content: string;

	constructor($id: number, $content: string) {
		this.id = $id;
		this.content = $content;
    }
    
    public get $id(): number {
		return this.id;
	}

	public set $id(value: number) {
		this.id = value;
	}
    

	public get $content(): string {
		return this.content;
	}

	public set $content(value: string) {
		this.content = value;
	}




}