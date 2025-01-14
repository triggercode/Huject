/**
 * Interface for creating objects from container dynamically
 */
export abstract class ContainerFactoryInterface {
  /**
   * Create object using the container. Will create new instance for each call
   * @param definition Class or string definition
   * @param constructorArgs Optional constructor arguments. Overrides constructor arguments in definition
   */
  public abstract make(definition: Function | string, constructorArgs?: Array<any>): any;
}
