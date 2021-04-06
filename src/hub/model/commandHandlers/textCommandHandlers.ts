import {CommandHandler} from "./types";
import {SendMessage} from "./SendMessage";
import {ChangeState} from "./ChangeState";
import {BulkChangeState} from "./BulkChangeState";
import {SetAccess} from "./SetAccess";
import {SyncTime} from "./SyncTime";

export const textCommandHandlers = new Map<string, CommandHandler>();
textCommandHandlers.set("SendMessage", SendMessage);
textCommandHandlers.set("ChangeState", ChangeState);
textCommandHandlers.set("BulkChangeState", BulkChangeState);
textCommandHandlers.set("SetAccess", SetAccess);
textCommandHandlers.set("SyncTime", SyncTime);