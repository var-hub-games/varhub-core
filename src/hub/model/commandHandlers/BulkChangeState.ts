import {CommandHandler} from "./types";
import {Replacement} from "../StateHandler";

export const BulkChangeState: CommandHandler = async (
    connection, room, pBulk
): Promise<void> => {
    if (!pBulk) return;
    if (!Array.isArray(pBulk)) throw new Error("path params");
    const replacements = pBulk.map(params => convertToReplacement(params));
    room.replaceState(replacements);
}

function convertToReplacement(params: any): Replacement {
    if (!params) throw new Error("path params");
    const path = convertToPath(params.path);
    const hash = params.hash == null ? null : Number(params.hash);
    const data = params.data;
    return {path, hash, data};
}

function convertToPath(pPath: any): (string|number)[]{
    if (pPath == null) return [];
    if (Array.isArray(pPath)) {
        return pPath.map(v => {
            if (typeof v === "number") return v;
            if (typeof v === "string") return v;
            throw new Error("path params");
        });
    }
    throw new Error("path params");
}