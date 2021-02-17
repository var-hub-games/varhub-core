export const MODEL_PARSE_SYMBOL = Symbol("ParseModelFromDB")

export abstract class Model {

    toViewJSON(): string {
        return JSON.stringify({...this})
    }

    static [MODEL_PARSE_SYMBOL](data: any) {
        return data;
    }
}