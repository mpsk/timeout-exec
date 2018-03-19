export declare type SandboxTimerItem = {
    id: number;
    type: 'timeout' | 'interval';
};
export declare type SandboxTimers = {
    [key: string]: Array<SandboxTimerItem>;
};
export interface IClear {
    clear(): void;
}
export interface IExecutor extends IClear {
    execute(resolve: Function): IClear;
}
export default class Timeout {
    private _sandbox;
    constructor();
    timer(ms: number, key?: string): IExecutor;
    interval(ms: number, key?: string): IExecutor;
    clearKey(key?: string): SandboxTimers;
    destroy(): SandboxTimers;
}
