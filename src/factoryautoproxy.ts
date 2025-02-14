import { ContainerResolver } from "./resolver";
import { FactoryMethod } from './definition';
/**
 * Proxy class for auto-factories
 */
export class FactoryAutoProxy {

  /**
   * Internal Resolver
   */
  private resolver: ContainerResolver;

  /**
   * Original factory definition
   */
  private originalDefinition: Function;

  /**
   * @constructor
   * @param resolver
   * @param originalDefinition
   */
  public constructor(resolver: ContainerResolver, originalDefinition: Function) {
    this.resolver = resolver;
    this.originalDefinition = originalDefinition;

    for (let propertyName in this.originalDefinition.prototype) {
      if (typeof this.originalDefinition.prototype[propertyName] === "function" && propertyName !== 'constructor') {
        if (Reflect.hasMetadata("inject:factorymethod", this.originalDefinition.prototype, propertyName)) {
          let returnType = Reflect.getMetadata("design:returntype", this.originalDefinition.prototype, propertyName);
          if (typeof returnType !== "function") {
            throw new Error(`Invalid factory method: ${propertyName} in ${this.originalDefinition.toString()}, return type should be constructor function`);
          }

          Object.defineProperty(this, propertyName, {
            value: this.createFactoryMethod(returnType)
          });
        }
      }
    }
  }

  /**
   * Creates factory method
   * @param createdObj
   * @returns {function(...[any]): *}
   */
  private createFactoryMethod(createdObj: Function): Function {
    return (...args: any[]) => {
      return this.resolver.resolve(createdObj, FactoryMethod.FACTORY, args, false);
    }
  }

}
