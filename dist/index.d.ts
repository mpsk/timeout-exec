declare module "Timeout" {
    export type SandboxTimers = {
        [key: string]: Array<number>;
    };
    class Timeout {
        private _sandbox;
        constructor();
        timer(ms: number, key: string): Promise<{}>;
        interval(ms: number, key: string): Promise<{}>;
        clearKey(key: string): SandboxTimers;
        destroy(): SandboxTimers;
    }
    export default Timeout;
}
