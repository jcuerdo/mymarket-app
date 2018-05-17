

export class Photo {
    private id: number;
    private content: string;

	constructor(id: number, content: string) {
		this.id = id;
		this.content = content;
	}
	
    public getId(): number {
		return this.id;
	}

	public setId(value: number) {
		this.id = value;
	}

	public getContent(): string {
		return this.content;
	}

	public setContent(value: string) {
		this.content = value;
	}
}