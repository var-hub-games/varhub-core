import stableStringify from "json-stable-stringify";
import CRC32 from "crc-32";

export type Step = number|string;
export type Path = readonly Step[];
export type TPath = Step[];
export interface Replacement {
    path: Path,
    data: any,
    hash: number|null
}
export interface ReplacementResult {
    path: Path,
    data: any
}
interface ModifierTask {
    source: any,
    key: number|string|undefined,
    value: any;
}
export class StateHandler {

    constructor(private state: any = null) {}

    getState(){
        return this.state;
    }

    setState(state: any){
        this.state = state;
    }

    select(path: (string|number)[], state = this.state): any{
        for (const step of path) {
            if (state == null) throw new Error("wrong path selector");
            if (Array.isArray(state)) {
                if (typeof step !== "number") throw new Error("wrong path selector");
            } else {
                if (typeof step !== "string") throw new Error("wrong path selector");
                if (!Object.prototype.hasOwnProperty.call(state, step)) throw new Error("wrong path selector");
            }
            state = state[step];
        }
        return state;
    }

    applyReplacements(replacements: Replacement[]): void {
        const paths = replacements.map(rep => rep.path);
        if (!isValidPaths(paths)) throw new Error("path intersect error");
        // create tasks to change state:
        const tasks: Set<ModifierTask> = new Set();
        for (let replacement of replacements) {
            const {path, data, hash} = replacement;
            let source: any = undefined;
            let replaceValue: any = undefined;
            let lastStep: string|number|undefined = undefined;
            if (path.length > 0) {
                const sourcePath = path.slice(0, path.length - 1);
                const lastStep = path[path.length - 1];
                source = this.select(sourcePath);
                replaceValue = this.select([lastStep], source);
            } else {
                replaceValue = this.state;
            }
            if (hash != null) {
                if (source === undefined) {
                    if (hash !== 0) throw new Error("hash error");
                } else {
                    if (CRC32.str(stableStringify(source)) !== hash) {
                        throw new Error("hash error");
                    }
                }
            }
            tasks.add({source, key:lastStep, value: data});
        }
        // apply tasks
        for (const {source, key, value} of tasks) {
            if (key === undefined) {
                this.state = value;
            } else {
                if (value === undefined) { // delete item
                    if (Array.isArray(source)) {
                        source.splice(Number(key), 1);
                    } else {
                        delete source[key];
                    }
                } else {
                    source[key] = value;
                }
            }
        }
    }
}

function isValidPaths(paths: readonly Path[]): boolean {
    const modPaths: TPath[] = paths.map(path => path.slice(0));
    return isValidPathsImpl(new Set(modPaths));

    function isValidPathsImpl(paths: Set<TPath>): boolean {
        if (paths.size <= 1) return true;
        const stepGroups = new Map<Step, Set<TPath>>();
        for (const path of paths) {
            if (path.length === 0) return false;
            const step = path.shift() as Step;
            let pathSet: Set<TPath>|undefined = stepGroups.get(step);
            if (!pathSet) {
                pathSet = new Set();
                stepGroups.set(step, pathSet);
            }
            pathSet.add(path);
        }
        for (const groupedPaths of stepGroups.values()) {
            if (!isValidPathsImpl(groupedPaths)) return false;
        }
        return true;
    }
}