
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
    const data = await usersDB.find({name});
    console.log("GET USER BY NAME",data)
    if (!data || !data.length) return null;
    const user = User[MODEL_PARSE_SYMBOL](data[0]);
    return user
}
const getUserById = async (id: string): Promise<User|null> => {
    const data = await usersDB.find({_id: id});
    if (!data || !data.length) return null;
    const user = User[MODEL_PARSE_SYMBOL](data[0]);
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
