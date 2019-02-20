# timeout-exec
[![npm version](https://badge.fury.io/js/timeout-exec.svg)](https://badge.fury.io/js/timeout-exec)
[![dependencies Status](https://david-dm.org/mpsk/timeout-exec/status.svg)](https://david-dm.org/mpsk/timeout-exec)
[![devDependencies Status](https://david-dm.org/mpsk/timeout-exec/dev-status.svg)](https://david-dm.org/mpsk/timeout-exec?type=dev)

Timeout Manager for control executions

## Install

```
$ npm install timeout-exec
```

## Typings
```typescript

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

```

## Usage

```typescript
// Example 1:
import Timeout from 'timeout-exec';
// Note if use in ES5
// var Timeout = require('timeout-exec').default;

const timeouts = new Timeout();

const run1 = timeouts.timer(1000);
run1.execute(() => (console.log('first run')));
// Console.log: [first run]

const run2 = timeouts
	.timer(2000)
	.execute(() => (console.log('second run')));
// Console.log: [second run]


// Function will not be called due to clear()
const run3 = timeouts
	.timer(3000)
	.execute(() => (console.log('third run')));
run3.clear();
```

```typescript
// Example 2:
const timeouts = new Timeout();
const run1 = timeouts.timer(2000);
run1.execute(() => (console.log('time run')));

const run2 = timeouts
	.interval(1000)
	.execute(() => (console.log('interval run')));

setTimeout(() => {
	timeouts.destroy();
}, 4000);

// Console.log: [interval run]
// Console.log: [time run]
// Console.log: [interval run]
// Console.log: [interval run]
// Console.log: [interval run]
// --- timeouts destroyed
```


## API

### const timeouts = new Timeout();

Returns an instance of execution manager

### // setTimeout
### timeouts.timer(ms: number, key: string = DEFAULT_KEY)
Return a decorated `execute` and `clear` for `setTimeout` call

#### ms
Type: `number`
Milliseconds before timing out.

#### key
Type: `string|undefined`
Default: `'no_name'`
Key for store in private sandbox by timeoutId.

You could for example retry:

```js
const timeouts = new Timeout();
const run1 = timeouts.timer(2000, 'SOME_KEY').execute(() => (console.log(new Date())));
const run2 = timeouts.timer(3000, 'SOME_KEY').execute(() => (console.log(new Date())));

timeouts.clearKey('SOME_KEY'); // will clear all timers with 'SOME_KEY' key;
// same as
run1.clear();
run2.clear();

```

### // setInterval
### timeouts.interval(ms: number, key: string = DEFAULT_KEY)
Return a decorated `execute` and `clear` for `setIterval` call

You could for example retry:

```js
const timeouts = new Timeout();
const timer1 = timeouts.timer(5000, 'SOME_KEY').execute(() => (console.log(new Date())));
const interval1 = timeouts.interval(2000, 'SOME_KEY').execute(() => (console.log(new Date())));
const interval2 = timeouts.interval(3000, 'SOME_KEY').execute(() => (console.log(new Date())));

timeouts.clearKey('SOME_KEY'); // will clear all timers and intervals with 'SOME_KEY' key;
// same as
timer1.clear();
interval1.clear();
interval2.clear();
```

### timeouts.clearKey(key: string = DEFAULT_KEY)
Clear all executions with specified key

#### key
Type: `string|undefined`
Default: `'no_name'`

### timeouts.destroy()
Clear all executions within instance

You could for example retry:
```js
const timeouts = new Timeout();
const key1 = timeouts.timer(5000, 'KEY1').execute(() => (console.log(new Date())));
const key_empty = timeouts.interval(2000).execute(() => (console.log(new Date())));
const key2 = timeouts.interval(3000, 'KEY2').execute(() => (console.log(new Date())));

timeouts.destroy(); // will clear all timers and intervals for all keys
// same as
key1.clear();
key_empty.clear();
key2.clear();
```