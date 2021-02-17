
import Datastore from 'nedb-promises';
import {User} from "./model/User";
import {MODEL_PARSE_SYMBOL} from "./model/Model";

let databaseLoaded = false;
const usersDB = new Datastore({ filename: 'users.db' });
async function loadDatabases() {
    await usersDB.load();
    usersDB.ensureIndex( { "fieldName": "name", unique: true })
    databaseLoaded = true;
}

loadDatabases()

const getUserByName = async (name: string): Promise<User|null> => {
    const data = await usersDB.findOne({
        name: { $regex: new RegExp("^" + name.toLowerCase(), "i") }
    });
    if (!data) return null;
    const user = User[MODEL_PARSE_SYMBOL](data);
    return user
}
const getUserById = async (id: string): Promise<User|null> => {
    const data = await usersDB.findOne({_id: id});
    if (!data) return null;
    const user = User[MODEL_PARSE_SYMBOL](data);
    return user
}
const createUser = async (name: string, password: string): Promise<User> => {
    const data = await usersDB.insert({name, password});
    const user = User[MODEL_PARSE_SYMBOL](data);
    console.log(user);
    return user
}

export const databaseService = {
    getUserByName,
    createUser,
    getUserById
}
