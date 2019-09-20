"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definition_1 = require("./definition");
var resolver_1 = require("./resolver");
var containerfactoryinterface_1 = require("./containerfactoryinterface");
var containerfactory_1 = require("./containerfactory");
var Container = (function () {
    function Container() {
        this.allowUnregisteredResolve = false;
        this.resolver = new resolver_1.ContainerResolver();
        var containerFactory = new containerfactory_1.ContainerFactory(this.resolver);
        this.register(containerfactoryinterface_1.ContainerFactoryInterface, containerFactory);
    }
    Container.prototype.setAllowUnregisteredResolving = function (allow) {
        this.allowUnregisteredResolve = allow;
    };
    Container.prototype.register = function (definition, implementationOrConstructorArgs, constructorArgs) {
        var def;
        if (!implementationOrConstructorArgs) {
            if (typeof definition === "string") {
                throw new Error("Can't register just symbol");
            }
            def = new definition_1.Definition(definition, definition);
        }
        else {
            if (typeof definition === "function") {
                if (implementationOrConstructorArgs instanceof Array) {
                    def = new definition_1.Definition(definition, definition, implementationOrConstructorArgs);
                }
                else {
                    if (typeof implementationOrConstructorArgs == "object") {
                        def = new definition_1.Definition(definition, implementationOrConstructorArgs, null, definition_1.FactoryMethod.OBJECT);
                    }
                    else {
                        def = new definition_1.Definition(definition, implementationOrConstructorArgs, constructorArgs);
                    }
                }
            }
            else {
                if (typeof implementationOrConstructorArgs === "function") {
                    def = new definition_1.Definition(definition, implementationOrConstructorArgs, constructorArgs);
                }
                else {
                    def = new definition_1.Definition(definition, implementationOrConstructorArgs, null, definition_1.FactoryMethod.OBJECT);
                }
            }
        }
        this.resolver.addDefinition(definition, def);
        return def;
    };
    Container.prototype.registerCallable = function (definition, callable) {
        var def;
        def = new definition_1.Definition(definition, callable, null, definition_1.FactoryMethod.SINGLETON, definition_1.DefinitionObjectType.CALLABLE);
        this.resolver.addDefinition(definition, def);
        return def;
    };
    Container.prototype.resolve = function (definition, method) {
        return this.resolver.resolve(definition, method, undefined, !this.allowUnregisteredResolve);
    };
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=container.js.map