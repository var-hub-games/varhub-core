import {CommandHandler} from "./types";

export const SetAccess: CommandHandler = async (
    connection, room, pAccountId, pMode
): Promise<void> => {
    if (connection.account.id !== room.ownerId) {
        throw new Error("not permitted");
    }
    const userId = String(pAccountId);
    if (pMode === "allow") {
        room.door.allowUserId(userId);
    } else if (pMode === "block") {
        room.door.blockUserId(userId);
    } else {
        throw new Error("protocol error");
    }
}