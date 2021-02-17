import {Model, MODEL_PARSE_SYMBOL} from "./Model";

export class User extends Model {
    id: string
    name: string
    password: string

    constructor(id?: string, name?: string, password?: string) {
        super();
        if (id) this.id = id;
        if (name) this.name = name;
        if (password) this.password = password;
    }

    toViewModel(): any {
        return {
            id: this.id,
            name: this.name
        };
    }

    static [MODEL_PARSE_SYMBOL](data: any): User {
        return new User(data._id, data.name, data.password);
    }
}