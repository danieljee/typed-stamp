export interface IMethods<thisType> {
    [key: string]: (this: thisType, ...args:any[]) => any;
}

export interface IInitializerArg {}

export type InitializerType<thisType, Arg = IInitializerArg> = (this: thisType, arg: Arg) => any;

export interface IDescriptor<thisType> {
    methods?: IMethods<thisType>;
    properties?: Object;
    deepProperties?: Object;
    propertyDescriptors?: PropertyDescriptorMap;
    initializer?: InitializerType<thisType>
}

export interface IComposable {
    [key: string]: any;
}

export type stamp = (arg: IInitializerArg) => IComposable;
