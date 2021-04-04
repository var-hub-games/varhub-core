import {CommandHandler} from "./types";
import {BulkChangeState} from "./BulkChangeState";
import {Replacement} from "../StateHandler";

export const ChangeState: CommandHandler = async (
    connection, room, path, hash, data
): Promise<void> => {
    return await BulkChangeState(connection, room, [{path, hash, data} as Replacement]);
}
