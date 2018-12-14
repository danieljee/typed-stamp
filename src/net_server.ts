import { 
    IDescriptorBase, 
    InitializerTypeBase
} from './types';
import * as net from 'net';
import { compose } from './compose';

export type ThisType = IProperties & IMethods;

export interface IInitializerArg {
    net: {
        port: number;
    }
}

export interface IConfig {
    port: number;
}

export interface IMethods {
    set_config: (this:ThisType, config: IConfig) => void;
    get_config: (this:ThisType) => IConfig;
    net_run: (this:ThisType) => void;
}

export interface IProperties {
    [key: string]: any;
    port: number;
}

export interface IDescriptor extends IDescriptorBase<ThisType, IInitializerArg> {
    properties: IProperties;
    methods: IMethods;
}

let descriptor: IDescriptor = {
    initializers: [
        function net_initializer(arg) {
            this.port = arg.net.port || 3050;
        }
    ],
    methods: {
        set_config(config: IConfig) {
            this.config = config;
        },
        get_config() {
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

export let stamp = compose(descriptor);