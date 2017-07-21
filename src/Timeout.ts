export type SandboxTimers = {
	[key: string]: Array<number>
};

const create = (key: string, timeIntervalId: any, sandbox: SandboxTimers) => {
	const interval = {key: timeIntervalId};
	if (typeof sandbox[key] === 'undefined') {
		sandbox[key] = [];
	}
	sandbox[key].push(timeIntervalId);
	return timeIntervalId;
};

const remove = (key, id, sandbox) => {
	sandbox[key].splice(sandbox[key].indexOf(id), 1);
};

class Timeout {
	private _sandbox: SandboxTimers;

	constructor() {
		this._sandbox = {};
	}

	timer(ms: number, key: string) {
		let timeoutId;
		const promise = new Promise((resolve) => {
			timeoutId = setTimeout(() => {
				resolve.call(null);
				remove(key, timeoutId, this._sandbox);	
			}, ms);
			create(key, timeoutId, this._sandbox);
		});
		promise['clear'] = () => {
			clearTimeout(timeoutId);
			remove(key, timeoutId, this._sandbox);
		};
		return promise;
	}

	interval(ms: number, key: string) {
		let intervalId;
		const promise = new Promise((resolve) => {
			intervalId = setInterval(resolve, ms);
			create(key, intervalId, this._sandbox);
		});
		promise['clear'] = () => {
			clearInterval(intervalId);
			remove(key, intervalId, this._sandbox);
		};
		return promise;
	}

	clearKey(key: string): SandboxTimers {
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

export default Timeout;