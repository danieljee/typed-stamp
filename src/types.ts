export interface IMethods<thisType = any> {
    [key: string]: (this: thisType, ...args:any[]) => any;
}

export interface IInitializerArg {}

export type InitializerType<thisType, Arg = IInitializerArg> = (this: thisType, arg: Arg) => any;

export interface IDescriptor {
    methods?: IMethods;
    properties?: Object;
    deepProperties?: Object;
    propertyDescriptors?: PropertyDescriptorMap;
    initializer?: InitializerType<Object>
}

export interface IComposable {
    [key: string]: any;
}

// ?
export type stamp = (arg: IInitializerArg) => IComposable;
