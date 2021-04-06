import {CommandHandler} from "./types";

export const SyncTime: CommandHandler = async (
    connection, room
): Promise<number> => {
    const [s, ns] = process.hrtime(room.hrTime);
    return s*1000 + ns/1000000;
}