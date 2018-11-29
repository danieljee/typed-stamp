import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase,
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';
import * as net from 'net';
import { compose } from './compose';

export type ThisType = IProperties & IMethods<IProperties>;

export interface IMethods<thisType> extends IMethodsBase<thisType> {
    setConfig: (this:thisType, config: IConfig) => void;
    getConfig: (this:thisType) => IConfig;
    net_run: (this:thisType) => void;
}

export interface IProperties {
    [key: string]: any;
    port: number;
}

export interface IDescriptor extends IDescriptorBase {
    initializer: InitializerType;
    properties: IProperties;
    methods: IMethods<ThisType>;
}

export interface IInitializerArg extends IInitializerArgBase {
    net: {
        port: number;
    }
}

export type InitializerType = InitializerTypeBase<ThisType, IInitializerArg>;

export interface IConfig {
    port: number;
}

export let descriptor: IDescriptor = {
    initializer(arg){
        this.port = arg.net.port || 3050;
    },
    methods: {
        setConfig(config: IConfig) {
            this.config = config;
        },
        getConfig() {
            return this.config;
        },
        net_run() {
            console.log(`running net server on port ${this.port}`);
        }
    },
    properties: {
        port: 3000
    },
    deepProperties: {}
}

export default compose(descriptor);