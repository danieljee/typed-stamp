import * as _ from 'lodash';
import { IDescriptor, IInitializerArg } from './types';

/*
    This is a simplified version of example implementation
    https://github.com/stampit-org/stamp-specification/blob/master/compose.js
*/

/*
    TODO: private functions and private properties. 
*/

function baseComposable(): IDescriptor{
    return {
        properties:{},
        propertyDescriptors:{},
        deepProperties: {},
        methods:{}
    }
}

function createStamp<initializerArgType, instanceProps>(descriptor: IDescriptor, initializers: Array<Function>){
    return function factory(initializerArg: initializerArgType){
        let instance: instanceProps = Object.create(descriptor.methods);

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

export function compose<initializerArgType, instanceProps>(...composables: IDescriptor[]){
    let initializers = composables.map(composable => composable.initializer);
    let descriptor = composables.reduce(mergeComposables, baseComposable());
    
    let stamp = createStamp<initializerArgType, instanceProps>(descriptor, initializers);

    return stamp;
}