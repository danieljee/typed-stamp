// often causes index signature missing type error.
// export interface IMethodsBase<thisType> {
//     [key: string]: (this: thisType, ...args:any[]) => any;
// }
export interface IMethodsBase<thisType> {}

export type InitializerTypeBase<thisType, Arg> = (this: thisType, arg: Arg) => any;

export interface IDescriptorBase<thisType, initializerArg> {
    methods: IMethodsBase<thisType>;
    properties: Object;
    deepProperties?: Object;
    propertyDescriptors?: PropertyDescriptorMap;
    initializers: Array<InitializerTypeBase<thisType, initializerArg>>
}

export interface IComposable {
    [key: string]: any;
}

export interface IStampMeta<thisType, initializerArg> extends IDescriptorBase<thisType, initializerArg>{
    (any): any;
}

export interface IStamp<thisType, initializerArg> {
    (any): any;
    compose: IStampMeta<thisType, initializerArg>
}

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