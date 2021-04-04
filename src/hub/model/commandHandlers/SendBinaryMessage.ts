import {BinaryCommandHandler} from "./types";

export const SendBinaryMessage: BinaryCommandHandler = async (
    connection, room, pData
): Promise<{[connectionId: string]: boolean}> => {
    const userCount = pData.readInt32LE(0);
    let offset = 4;
    const recipients: string[] = [];
    for (let i = 0; i < userCount; i++) {
        const userNameLen = pData.readUInt32LE(offset);
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
    const toConnections = userCount === -1 ? null : recipients;
    return room.sendMessage(connection.id, toConnections, asService, message);
}