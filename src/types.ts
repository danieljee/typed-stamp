export interface IMethods<thisType> {
    [key: string]: (this: thisType, ...args:any[]) => any;
}

export interface IInitializerArg {}

export type InitializerType<thisType, Arg = IInitializerArg> = (this: thisType, arg: Arg) => any;

export interface IDescriptor<thisType = Object> {
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

export interface IJsonRpc {
    jsonrpc: '2.0',
    method: string,
    params: any
    id: string
}

export enum JsonRpcErrorEnum {
    PARSE_ERROR = -32700,
    INVALID_REQUEST = -32600,
    METHOD_NOT_FOUND = -32601,
    INVALID_PARAMS = -32602,
    INTERNAL_ERROR = -32603
}