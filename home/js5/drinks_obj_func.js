function ObjStorageFunc() {
    this.storage = {};
    this.addValue = function (key, value) {
        this.storage[key] = value;
    }
    this.getValue = function (key) {
        return this.storage[key];
    }
    this.deleteValue = function (key) {
        if (this.storage.hasOwnProperty(key)) {
            delete this.storage[key];
            return true;
        }
        return false;
    }
    this.getKeys = function () {
        return Object.keys(this.storage);
    }
}
var drinkStorage = new ObjStorageFunc;