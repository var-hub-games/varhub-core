import {BinaryCommandHandler, CommandHandler} from "./types";
import {SendMessage} from "./SendMessage";
import {ChangeState} from "./ChangeState";
import {BulkChangeState} from "./BulkChangeState";
import {SetAccess} from "./SetAccess";
import {SendBinaryMessage} from "./SendBinaryMessage";

export const binCommandHandlers = new Map<number, BinaryCommandHandler>();
binCommandHandlers.set(0x00_00_20_01, SendBinaryMessage);