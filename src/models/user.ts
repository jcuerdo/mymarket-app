

export class User {
    private id: number;
	private email: string;
	private password: string;
	private fullname: string;
	private photo: string;
	private description: string;
    private role: string;
    private token: string;

    /**
     * Getter $id
     * @return {number}
     */
	public get $id(): number {
		return this.id;
	}

    /**
     * Getter $email
     * @return {string}
     */
	public get $email(): string {
		return this.email;
    }
    
    /**
     * Getter $token
     * @return {string}
     */
	public get $token(): string {
		return this.token;
	}

    /**
     * Getter $password
     * @return {string}
     */
	public get $password(): string {
		return this.password;
	}

    /**
     * Getter $fullname
     * @return {string}
     */
	public get $fullname(): string {
		return this.fullname;
	}

    /**
     * Getter $photo
     * @return {string}
     */
	public get $photo(): string {
		return this.photo;
	}

    /**
     * Getter $description
     * @return {string}
     */
	public get $description(): string {
		return this.description;
	}

    /**
     * Getter $role
     * @return {string}
     */
	public get $role(): string {
		return this.role;
	}

    /**
     * Setter $id
     * @param {number} value
     */
	public set $id(value: number) {
		this.id = value;
	}

    /**
     * Setter $email
     * @param {string} value
     */
	public set $email(value: string) {
		this.email = value;
    }
    
        /**
     * Setter $token
     * @param {string} value
     */
	public set $token(value: string) {
		this.token = value;
	}

    /**
     * Setter $password
     * @param {string} value
     */
	public set $password(value: string) {
		this.password = value;
	}

    /**
     * Setter $fullname
     * @param {string} value
     */
	public set $fullname(value: string) {
		this.fullname = value;
	}

    /**
     * Setter $photo
     * @param {string} value
     */
	public set $photo(value: string) {
		this.photo = value;
	}

    /**
     * Setter $description
     * @param {string} value
     */
	public set $description(value: string) {
		this.description = value;
	}

    /**
     * Setter $role
     * @param {string} value
     */
	public set $role(value: string) {
		this.role = value;
	}

    
}