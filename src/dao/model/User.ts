export class User {
    id: string
    name: string

    constructor(id?: string, name?: string) {
        if (id) this.id = id;
        if (name) this.name = name;
    }
}