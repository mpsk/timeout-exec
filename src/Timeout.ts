export type SandboxTimerItem = {
	id: number;
	type: 'timeout'|'interval';
}

export type SandboxTimers = {
	[key: string]: Array<SandboxTimerItem>;
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
		const type = 'timeout';
		const sandbox = this._sandbox;

		const clear = () => {
			clearTimeout(timeoutId);
			remove(key, sandbox, timeoutId, type);
		};

		return {
			execute(resolve: Function) {
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

	interval(ms: number, key: string = DEFAULT_KEY): IExecutor {
		let intervalId;
		const type = 'interval';
		const sandbox = this._sandbox;

		const clear = () => {
			clearInterval(intervalId);
			remove(key, sandbox, intervalId, type);
		};

		return {
			execute(resolve: Function) {
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
				if (item.type === 'timeout') {
					clearTimeout(item.id);
				}
				if (item.type === 'interval') {
					clearInterval(item.id);
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