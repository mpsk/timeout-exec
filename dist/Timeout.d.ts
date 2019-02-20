export declare enum TimerType {
    timeout = "timeout",
    interval = "interval"
}
export declare type SandboxTimerItem = {
    id: number;
    type: TimerType;
};
export declare type SandboxTimers = Record<string, SandboxTimerItem[]>;
export interface Clear {
    clear(): void;
}
export interface Executor extends Clear {
    execute(resolve: Function): Clear;
}
export default class Timeout {
    private _sandbox;
    constructor();
    timer(ms: number, key?: string): Executor;
    interval(ms: number, key?: string): Executor;
    clearKey(key?: string): SandboxTimers;
    destroy(): SandboxTimers;
}
