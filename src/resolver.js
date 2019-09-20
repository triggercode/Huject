"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("es6-collections");
require("reflect-metadata");
var definition_1 = require("./definition");
var definition_2 = require("./definition");
var factoryautoproxy_1 = require("./factoryautoproxy");
var ContainerResolver = (function () {
    function ContainerResolver() {
        this.singletonObjects = new WeakMap();
        this.definitions = new Map();
    }
    ContainerResolver.prototype.addDefinition = function (key, def) {
        this.definitions.set(key, def);
    };
    ContainerResolver.prototype.getDefinition = function (key) {
        return this.definitions.get(key);
    };
    ContainerResolver.prototype.hasDefinition = function (key) {
        return this.definitions.has(key);
    };
    ContainerResolver.prototype.resolve = function (definition, method, constructorArgs, strict) {
        if (strict === void 0) { strict = true; }
        var internalDefinition = null;
        if (typeof definition === "function" && Reflect.hasOwnMetadata("inject:autofactory", definition)) {
            var factoryProxy = new factoryautoproxy_1.FactoryAutoProxy(this, definition);
            internalDefinition = new definition_1.Definition(definition, factoryProxy, null, definition_2.FactoryMethod.OBJECT);
        }
        else {
            internalDefinition = this.definitions.get(definition);
        }
        if (!internalDefinition) {
            if (strict || typeof definition === 'string') {
                throw new Error("Unknown definition: " + definition.toString());
            }
            else {
                internalDefinition = new definition_1.Definition(definition, definition);
            }
        }
        var constructor = this.resolveDefinition(internalDefinition);
        var constructorArguments = [];
        if (internalDefinition.definitionObjectType !== definition_2.DefinitionObjectType.CALLABLE && internalDefinition.method !== definition_2.FactoryMethod.OBJECT) {
            if (typeof constructorArgs !== 'undefined' && constructorArgs.length > 0) {
                constructorArguments = constructorArgs;
            }
            else {
                constructorArguments = this.resolveConstructorArguments(internalDefinition, constructor, strict);
            }
        }
        var resolveMethod = internalDefinition.method;
        if (typeof method !== "undefined" && internalDefinition.method != definition_2.FactoryMethod.OBJECT) {
            resolveMethod = method;
        }
        switch (resolveMethod) {
            case definition_2.FactoryMethod.SINGLETON:
                if (!this.singletonObjects.has(internalDefinition)) {
                    if (internalDefinition.definitionObjectType == definition_2.DefinitionObjectType.CALLABLE) {
                        this.singletonObjects.set(internalDefinition, constructor.call(this));
                    }
                    else {
                        var obj = new (constructor.bind.apply(constructor, [void 0].concat(constructorArguments)))();
                        this.resolveProperties(obj, strict);
                        this.singletonObjects.set(internalDefinition, obj);
                    }
                }
                return this.singletonObjects.get(internalDefinition);
            case definition_2.FactoryMethod.FACTORY:
                if (internalDefinition.definitionObjectType == definition_2.DefinitionObjectType.CALLABLE) {
                    return constructor.call(this);
                }
                else {
                    var obj = new (constructor.bind.apply(constructor, [void 0].concat(constructorArguments)))();
                    this.resolveProperties(obj, strict);
                    return obj;
                }
            case definition_2.FactoryMethod.OBJECT:
                return constructor;
        }
    };
    ContainerResolver.prototype.resolveDefinition = function (definition) {
        if (definition.definitionObjectType == definition_2.DefinitionObjectType.CALLABLE || definition.method == definition_2.FactoryMethod.OBJECT) {
            return definition.definitionConstructor;
        }
        return this.resolveConstructor(definition);
    };
    ContainerResolver.prototype.resolveProperties = function (object, strict) {
        if (strict === void 0) { strict = true; }
        for (var key in object) {
            if (Reflect.hasMetadata("inject:property", object, key)) {
                var method = Reflect.getMetadata("inject:property", object, key);
                var paramDefinition = void 0;
                if (Reflect.hasMetadata('inject:property:literal', object, key)) {
                    paramDefinition = Reflect.getMetadata('inject:property:literal', object, key);
                }
                else {
                    paramDefinition = Reflect.getMetadata('design:type', object, key);
                }
                var resolvedObj = void 0;
                try {
                    resolvedObj = this.resolve(paramDefinition, method, undefined, strict);
                    object[key] = resolvedObj;
                }
                catch (e) {
                    if (!Reflect.hasMetadata('inject:property:optional', object, key)) {
                        throw new Error("Unknown definition: " + paramDefinition.toString());
                    }
                }
            }
        }
    };
    ContainerResolver.prototype.resolveConstructor = function (definition) {
        var constructor = definition.definitionConstructor;
        if (this.definitions.has(constructor) && constructor != definition.key) {
            constructor = this.resolveConstructor(this.definitions.get(constructor));
        }
        return constructor;
    };
    ContainerResolver.prototype.resolveConstructorArguments = function (definition, constructor, strict) {
        if (strict === void 0) { strict = true; }
        var constructorArguments = [];
        if (Reflect.hasOwnMetadata("inject:constructor", constructor)) {
            var dependencies = Reflect.getOwnMetadata("design:paramtypes", constructor);
            var resolvedDeps = [];
            if (dependencies) {
                for (var i = 0; i < dependencies.length; i++) {
                    var dep = dependencies[i];
                    var method = Reflect.getOwnMetadata('inject:constructor:param' + i + ':method', constructor);
                    if (Reflect.hasOwnMetadata('inject:constructor:param' + i + ':literal', constructor)) {
                        dep = Reflect.getOwnMetadata('inject:constructor:param' + i + ':literal', constructor);
                    }
                    var resolvedDep = void 0;
                    try {
                        resolvedDep = this.resolve(dep, method, undefined, strict);
                    }
                    catch (e) {
                        if (Reflect.hasOwnMetadata('inject:constructor:param' + i + ':optional', constructor)) {
                            resolvedDep = null;
                        }
                        else {
                            throw e;
                        }
                    }
                    resolvedDeps.push(resolvedDep);
                }
            }
            constructorArguments = resolvedDeps;
        }
        else {
            constructorArguments = this.resolveConstructorArgumentsFromDefinition(definition);
            if (!constructorArguments) {
                constructorArguments = [];
            }
        }
        return constructorArguments;
    };
    ContainerResolver.prototype.resolveConstructorArgumentsFromDefinition = function (definition) {
        var constructorArgs = definition.constructorArgs;
        if (!constructorArgs && this.definitions.has(definition.definitionConstructor) && (definition.definitionConstructor != definition.key)) {
            constructorArgs = this.resolveConstructorArgumentsFromDefinition(this.definitions.get(definition.definitionConstructor));
        }
        return constructorArgs;
    };
    return ContainerResolver;
}());
exports.ContainerResolver = ContainerResolver;
//# sourceMappingURL=resolver.js.map