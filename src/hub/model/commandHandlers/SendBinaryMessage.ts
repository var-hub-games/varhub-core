import {BinaryCommandHandler} from "./types";

export const SendBinaryMessage: BinaryCommandHandler = async (
    connection, room, pData
): Promise<{[connectionId: string]: boolean}> => {
    const result: {[connectionId: string]: boolean} = {};
    const userCount = pData.readUInt32BE(0);
    let offset = 0;
    const recipients: string[] = [];
    for (let i = 0; i < userCount; i++) {
        const userNameLen = pData.readUInt32BE(offset);
        offset += 4;
        const userName = pData.slice(offset, offset+userNameLen).toString("utf8");
        offset += userNameLen;
        recipients.push(userName);
    }
    const asService = pData.readUInt8(offset) !== 0;
    offset += 1;
    if (asService && connection.account.id !== room.ownerId) {
        throw new Error("not permitted");
    }
    const message = pData.slice(offset);
    return room.sendMessage(connection.id, recipients, asService, message);
}