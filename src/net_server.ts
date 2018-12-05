import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase,
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';
import * as net from 'net';
import { compose } from './compose';

export type ThisType = IProperties & IMethods<IProperties>;

export interface IDescriptor<thisType> extends IDescriptorBase<thisType> {
    initializer: InitializerTypeBase<thisType, IInitializerArg>;
    properties: IProperties;
    methods: IMethods<thisType>;
}

export interface IMethods<thisType> extends IMethodsBase<thisType> {
    setConfig: (this:thisType, config: IConfig) => void;
    getConfig: (this:thisType) => IConfig;
    net_run: (this:thisType) => void;
}

export interface IProperties {
    [key: string]: any;
    port: number;
}

export interface IInitializerArg extends IInitializerArgBase {
    net: {
        port: number;
    }
}

export interface IConfig {
    port: number;
}

export let descriptor: IDescriptor<ThisType> = {
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