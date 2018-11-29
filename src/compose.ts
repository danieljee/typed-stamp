import * as _ from 'lodash';
import { IDescriptor, IInitializerArg, stamp } from './types';

/*
    Cut down version of example implementation
    https://github.com/stampit-org/stamp-specification/blob/master/compose.js
*/

/*
    TODO: private functions and private properties. 
*/

let baseComposable:IDescriptor = {
    properties:{},
    propertyDescriptors:{},
    deepProperties: {},
    methods:{}
}

function createStamp<initializerArgType>(descriptor: IDescriptor, initializers: Array<Function>): stamp{
    return function factory(initializerArg: initializerArgType){
        let instance = Object.create(descriptor.methods);

        Object.assign(instance, descriptor.properties);
        Object.assign(instance, descriptor.deepProperties);
        Object.defineProperties(instance, descriptor.propertyDescriptors);

        return initializers.reduce((initializedInstance, initializer) => {
            initializer.call(instance, initializerArg);
            return instance;
        }, instance);
    }
}

function mergeComposables(mergedDescriptor:IDescriptor, src:IDescriptor){
    Object.assign(mergedDescriptor.properties, src.properties);
    Object.assign(mergedDescriptor.propertyDescriptors, src.propertyDescriptors);
    Object.assign(mergedDescriptor.methods, src.methods);
    _.merge(mergedDescriptor.deepProperties, src.deepProperties);
    return mergedDescriptor;
}

export function compose<initializerArgType = IInitializerArg>(...composables: IDescriptor[]){
    let initializers = composables.map(composable => composable.initializer);
    let descriptor = composables.reduce(mergeComposables, baseComposable);
    
    let stamp = createStamp<initializerArgType>(descriptor, initializers);

    return stamp;
}