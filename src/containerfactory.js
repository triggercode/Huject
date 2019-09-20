"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definition_1 = require("./definition");
var ContainerFactory = (function () {
    function ContainerFactory(resolver) {
        this.resolver = resolver;
    }
    ContainerFactory.prototype.make = function (definition, constructorArgs) {
        if (typeof definition === "string" && !this.resolver.hasDefinition(definition)) {
            throw new Error("Unknown definition: " + definition);
        }
        return this.resolver.resolve(definition, definition_1.FactoryMethod.FACTORY, constructorArgs, false);
    };
    return ContainerFactory;
}());
exports.ContainerFactory = ContainerFactory;
//# sourceMappingURL=containerfactory.js.map