export const MODEL_PARSE_SYMBOL = Symbol("ParseModelFromDB")

export abstract class Model {

    toViewModel() {
        return {...this}
    }

    static [MODEL_PARSE_SYMBOL](data: any) {
        return data;
    }
}