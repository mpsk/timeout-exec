export enum TimerType {
  timeout = 'timeout',
  interval = 'interval'
}

export type SandboxTimerItem = {
  id: number;
  type: TimerType;
}

export type SandboxTimers = Record<string, SandboxTimerItem[]>;

export interface Clear {
  clear(): void;
}
export interface Executor extends Clear {
  execute(resolve: Function): Clear;
}

const DEFAULT_KEY = 'no_name';

export default class Timeout {
  private _sandbox: SandboxTimers;

  constructor() {
    this._sandbox = {};
  }

  timer(ms: number, key: string = DEFAULT_KEY): Executor {
    let timeoutId: number;
    const type = TimerType.timeout;
    const sandbox = this._sandbox;

    const clear = () => {
      clearTimeout(timeoutId);
      remove(key, sandbox, timeoutId, type);
    };

    return {
      execute(resolve: Function): Clear {
        timeoutId = setTimeout(() => {
          resolve();
          remove(key, sandbox, timeoutId, type);
        }, ms);
        create(key, sandbox, {id: timeoutId, type});
        return {clear};
      },
      clear: clear
    }
  }

  interval(ms: number, key: string = DEFAULT_KEY): Executor {
    let intervalId: number;
    const type = TimerType.interval;
    const sandbox = this._sandbox;

    const clear = () => {
      clearInterval(intervalId);
      remove(key, sandbox, intervalId, type);
    };

    return {
      execute(resolve: Function): Clear {
        intervalId = setInterval(resolve, ms);
        create(key, sandbox, {id: intervalId, type});
        return {clear};
      },
      clear: clear
    }
  }

  clearKey(key: string = DEFAULT_KEY): SandboxTimers {
    if (this._sandbox[key]) {
      this._sandbox[key].forEach((item) => {
        switch (item.type) {
          case TimerType.timeout:
            clearTimeout(item.id);
            break;
          case TimerType.interval:
            clearInterval(item.id);
            break;
          default:
            throw new Error('SandboxTimer type should be enum TimerType')
            break;
        }
      });
      delete this._sandbox[key];
    }

    return this._sandbox;
  }

  destroy(): SandboxTimers {
    Object.keys(this._sandbox).forEach(this.clearKey.bind(this));
    return this._sandbox;
  }
}

function create(key: string, sandbox: SandboxTimers, timeItem: SandboxTimerItem) {
  if (typeof sandbox[key] === 'undefined') {
    sandbox[key] = [];
  }
  sandbox[key].push(timeItem);
  return sandbox;
};

function remove(key: string, sandbox: SandboxTimers, id: number, type) {
  const item = sandbox[key].find(item => item.type === type && item.id === id);
  sandbox[key].splice(sandbox[key].indexOf(item), 1);
};