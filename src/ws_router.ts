import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase, 
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';

import { compose } from './compose';

import { EventEmitter } from 'events';

export type ThisType = IProperties & IMethods<IProperties>;

export interface IDescriptor<thisType> extends IDescriptorBase<thisType> {
    properties: IProperties;
    methods: IMethods<thisType>
}

export interface IMethods<thisType> extends IMethodsBase<thisType> {
    setup_routing_key: (key: string) => void;
    handle_subscription: (key: string) => void;
}

export interface IProperties {}

let descriptor: IDescriptor<ThisType> = {
    initializer(){
        
    },
    methods: {
        setup_routing_key(key) {

        },

        handle_subscription(key) {

        },


    },
    properties: {
        
    },
} 

/*
    compose http server stamp with ws_router stamp so that
    on request to http server to create routing key, setup_routing_key is called.
*/