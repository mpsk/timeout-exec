define("Timeout", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var create = function (key, timeIntervalId, sandbox) {
        var interval = { key: timeIntervalId };
        if (typeof sandbox[key] === 'undefined') {
            sandbox[key] = [];
        }
        sandbox[key].push(timeIntervalId);
        return timeIntervalId;
    };
    var remove = function (key, id, sandbox) {
        sandbox[key].splice(sandbox[key].indexOf(id), 1);
    };
    var Timeout = (function () {
        function Timeout() {
            this._sandbox = {};
        }
        Timeout.prototype.timer = function (ms, key) {
            var _this = this;
            var timeoutId;
            var promise = new Promise(function (resolve) {
                timeoutId = setTimeout(function () {
                    resolve.call(null);
                    remove(key, timeoutId, _this._sandbox);
                }, ms);
                create(key, timeoutId, _this._sandbox);
            });
            promise['clear'] = function () {
                clearTimeout(timeoutId);
                remove(key, timeoutId, _this._sandbox);
            };
            return promise;
        };
        Timeout.prototype.interval = function (ms, key) {
            var _this = this;
            var intervalId;
            var promise = new Promise(function (resolve) {
                intervalId = setInterval(resolve, ms);
                create(key, intervalId, _this._sandbox);
            });
            promise['clear'] = function () {
                clearInterval(intervalId);
                remove(key, intervalId, _this._sandbox);
            };
            return promise;
        };
        Timeout.prototype.clearKey = function (key) {
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
});
