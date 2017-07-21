"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_KEY = 'no_name';
var Timeout = (function () {
    function Timeout() {
        this._sandbox = {};
    }
    Timeout.prototype.timer = function (ms, key) {
        if (key === void 0) { key = DEFAULT_KEY; }
        var timeoutId;
        var sandbox = this._sandbox;
        var clear = function () {
            clearTimeout(timeoutId);
            remove(key, timeoutId, sandbox);
        };
        return {
            execute: function (resolve) {
                timeoutId = setTimeout(function () {
                    resolve();
                    remove(key, timeoutId, sandbox);
                }, ms);
                create(key, timeoutId, sandbox);
                return { clear: clear };
            },
            clear: clear
        };
    };
    Timeout.prototype.interval = function (ms, key) {
        if (key === void 0) { key = DEFAULT_KEY; }
        var intervalId;
        var sandbox = this._sandbox;
        var clear = function () {
            clearInterval(intervalId);
            remove(key, intervalId, sandbox);
        };
        return {
            execute: function (resolve) {
                intervalId = setInterval(resolve, ms);
                create(key, intervalId, sandbox);
                return { clear: clear };
            },
            clear: clear
        };
    };
    Timeout.prototype.clearKey = function (key) {
        if (key === void 0) { key = DEFAULT_KEY; }
        if (this._sandbox[key]) {
            this._sandbox[key].forEach(function (id) { return clearInterval(id); });
            delete this._sandbox[key];
        }
        return this._sandbox;
    };
    Timeout.prototype.destroy = function () {
        Object.keys(this._sandbox).forEach(this.clearKey);
        return this._sandbox;
    };
    return Timeout;
}());
exports.default = Timeout;
function create(key, timeIntervalId, sandbox) {
    var interval = { key: timeIntervalId };
    if (typeof sandbox[key] === 'undefined') {
        sandbox[key] = [];
    }
    sandbox[key].push(timeIntervalId);
    return timeIntervalId;
}
;
function remove(key, id, sandbox) {
    sandbox[key].splice(sandbox[key].indexOf(id), 1);
}
;
//# sourceMappingURL=Timeout.js.map