import {CommandHandler} from "./types";

export const SendMessage: CommandHandler = async (
    connection, room, pRecipients, pService, pMessage
): Promise<{[connectionId: string]: boolean}> => {
    const asService = Boolean(pService);
    if (asService && connection.account.id !== room.ownerId) {
        throw new Error("not permitted");
    }
    const message = String(pMessage);
    const recipients = pRecipients ? (pRecipients as any[]).map(String) : null;
    return room.sendMessage(connection.id, recipients, asService, message);
}