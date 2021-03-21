export type DOOR_MODE =
    | "open"
    | "knock"
    | "closed"
;

export interface IDoor {
    mode: DOOR_MODE,
    allowIds: Set<string>,
    blockIds: Set<string>,
}
