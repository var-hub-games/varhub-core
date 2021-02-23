type DOOR_MODE =
    | "open"
    | "knock"
    | "closed"
;

export interface IDoor {
    mode: DOOR_MODE,
    allowlist: string[],
    blocklist: string[],
}
