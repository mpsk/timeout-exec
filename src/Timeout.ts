export type SandboxTimers = {
	[key: string]: Array<number>;
};

export interface IClear {
	clear(): void;
}
export interface IExecutor extends IClear {
	execute(resolve: Function): IClear;
}

const DEFAULT_KEY = 'no_name';

export default class Timeout {
	private _sandbox: SandboxTimers;

	constructor() {
		this._sandbox = {};
	}

	timer(ms: number, key: string = DEFAULT_KEY): IExecutor {
		let timeoutId;
		const sandbox = this._sandbox;

		const clear = () => {
			clearTimeout(timeoutId);
			remove(key, timeoutId, sandbox);
		};

		return {
			execute(resolve: Function) {
				timeoutId = setTimeout(() => {
					resolve();
					remove(key, timeoutId, sandbox);
				}, ms);
				create(key, timeoutId, sandbox);
				return {clear};
			},
			clear: clear
		}
	}

	interval(ms: number, key: string = DEFAULT_KEY): IExecutor {
		let intervalId;
		const sandbox = this._sandbox;

		const clear = () => {
			clearInterval(intervalId);
			remove(key, intervalId, sandbox);
		};

		return {
			execute(resolve: Function) {
				intervalId = setInterval(resolve, ms);
				create(key, intervalId, sandbox);
				return {clear};
			},
			clear: clear
		}
	}

	clearKey(key: string = DEFAULT_KEY): SandboxTimers {
		if (this._sandbox[key]) {
			this._sandbox[key].forEach(id => clearInterval(id));
			delete this._sandbox[key];
		}

		return this._sandbox;
	}

	destroy(): SandboxTimers {
		Object.keys(this._sandbox).forEach(this.clearKey);
		return this._sandbox;
	}
}

function create(key: string, timeIntervalId: any, sandbox: SandboxTimers) {
	const interval = {key: timeIntervalId};
	if (typeof sandbox[key] === 'undefined') {
		sandbox[key] = [];
	}
	sandbox[key].push(timeIntervalId);
	return timeIntervalId;
};

function remove(key, id, sandbox) {
	sandbox[key].splice(sandbox[key].indexOf(id), 1);
};