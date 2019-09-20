"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function ConstructorInject(targetOrFactoryMethodOrLiteral, factoryMethod) {
    var method = undefined;
    switch (typeof targetOrFactoryMethodOrLiteral) {
        case 'function':
            Reflect.defineMetadata('inject:constructor', true, targetOrFactoryMethodOrLiteral);
            return targetOrFactoryMethodOrLiteral;
        case 'number':
            if (typeof targetOrFactoryMethodOrLiteral === 'number') {
                method = targetOrFactoryMethodOrLiteral;
            }
            return function (target, _propertyKey, parameterIndex) {
                var metadataName = 'inject:constructor:param' + parameterIndex + ':method';
                Reflect.defineMetadata(metadataName, method, target);
            };
        case 'string':
            var literal_1 = targetOrFactoryMethodOrLiteral;
            method = factoryMethod;
            return function (target, _propertyKey, parameterIndex) {
                var metadataLiteralName = 'inject:constructor:param' + parameterIndex + ':literal';
                var metadataFactoryName = 'inject:constructor:param' + parameterIndex + ':method';
                Reflect.defineMetadata(metadataLiteralName, literal_1, target);
                Reflect.defineMetadata(metadataFactoryName, method, target);
            };
    }
}
exports.ConstructorInject = ConstructorInject;
function Inject(targetOrFactoryMethodOrLiteral, propertyKeyOrFactoryMethod) {
    var method = undefined;
    switch (typeof targetOrFactoryMethodOrLiteral) {
        case 'object':
            if (typeof propertyKeyOrFactoryMethod === 'string') {
                var propertyKey = propertyKeyOrFactoryMethod;
                if (!targetOrFactoryMethodOrLiteral.hasOwnProperty(propertyKey)) {
                    Object.defineProperty(targetOrFactoryMethodOrLiteral, propertyKey, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: null
                    });
                }
                Reflect.defineMetadata("inject:property", method, targetOrFactoryMethodOrLiteral, propertyKey);
            }
            break;
        case 'string':
            var literal_2 = targetOrFactoryMethodOrLiteral;
            if (typeof propertyKeyOrFactoryMethod === "number") {
                method = propertyKeyOrFactoryMethod;
            }
            return function (target, propertyKey) {
                if (!target.hasOwnProperty(propertyKey)) {
                    Object.defineProperty(target, propertyKey, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: null
                    });
                }
                Reflect.defineMetadata("inject:property", method, target, propertyKey);
                Reflect.defineMetadata('inject:property:literal', literal_2, target, propertyKey);
            };
        case 'number':
            method = targetOrFactoryMethodOrLiteral;
            return function (target, propertyKey) {
                if (!target.hasOwnProperty(propertyKey)) {
                    Object.defineProperty(target, propertyKey, {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: null
                    });
                }
                Reflect.defineMetadata("inject:property", method, target, propertyKey);
            };
    }
}
exports.Inject = Inject;
function Optional() {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
    return function (target, propertyKey, parameterIndex) {
        if (typeof parameterIndex === "undefined") {
            Reflect.defineMetadata("inject:property:optional", true, target, propertyKey);
        }
        else {
            var metadataName = 'inject:constructor:param' + parameterIndex + ':optional';
            Reflect.defineMetadata(metadataName, true, target);
        }
    };
}
exports.Optional = Optional;
function Factory() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var target;
    switch (args.length) {
        case 1:
            target = args[0];
            Reflect.defineMetadata('inject:autofactory', true, target);
            return target;
        case 3:
            target = args[0];
            var propertyKey = args[1];
            Reflect.defineMetadata('inject:factorymethod', true, target, propertyKey);
            return args[2];
        default:
            throw new Error("@Factory decorator is not allowed here");
    }
}
exports.Factory = Factory;
//# sourceMappingURL=decorators.js.map