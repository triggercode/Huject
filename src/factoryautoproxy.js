"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definition_1 = require("./definition");
var FactoryAutoProxy = (function () {
    function FactoryAutoProxy(resolver, originalDefinition) {
        this.resolver = resolver;
        this.originalDefinition = originalDefinition;
        for (var propertyName in this.originalDefinition.prototype) {
            if (typeof this.originalDefinition.prototype[propertyName] === "function" && propertyName !== 'constructor') {
                if (Reflect.hasMetadata("inject:factorymethod", this.originalDefinition.prototype, propertyName)) {
                    var returnType = Reflect.getMetadata("design:returntype", this.originalDefinition.prototype, propertyName);
                    if (typeof returnType !== "function") {
                        throw new Error("Invalid factory method: " + propertyName + " in " + this.originalDefinition.toString() + ", return type should be constructor function");
                    }
                    Object.defineProperty(this, propertyName, {
                        value: this.createFactoryMethod(returnType)
                    });
                }
            }
        }
    }
    FactoryAutoProxy.prototype.createFactoryMethod = function (createdObj) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.resolver.resolve(createdObj, definition_1.FactoryMethod.FACTORY, args, false);
        };
    };
    return FactoryAutoProxy;
}());
exports.FactoryAutoProxy = FactoryAutoProxy;
//# sourceMappingURL=factoryautoproxy.js.map