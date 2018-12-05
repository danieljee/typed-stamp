import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase, 
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';

import { compose } from './compose';

import { EventEmitter } from 'events';

export type ThisType = IProperties & IMethods<IProperties>;

/*
    EventEmitterType was required to suppress typescript error
    If IMethods was to extend EventEmitter directly:
        interface IMethods<thisType> extends IMethodsBase<thisType>, EventEmitter {}
    and methods was as follows:
        method: Object.assign(EventEmitter.prototype, {
            
        })
    EventEmitter.prototype has type EventEmitter
    The transpiler would throw an error saying that it violates index structure of IMethodsBase
    since EventEmitter does not have a define index structure whereas IMethodsBase does ([key:string])
*/

type EventEmitterType = {
    [k in keyof EventEmitter]: EventEmitter[k];
}

export interface IDescriptor<thisType> extends IDescriptorBase<thisType> {
    properties: IProperties;
    methods: IMethods<thisType>
}

export interface IMethods<thisType> extends IMethodsBase<thisType>, EventEmitterType {}

export interface IProperties {}

let descriptor: IDescriptor<ThisType> = {
    initializer(){
        
    },
    methods: Object.assign(<EventEmitterType>EventEmitter.prototype, {
        setup_routing_key(key: string) {

        }

        
    }),
    properties: {},
}