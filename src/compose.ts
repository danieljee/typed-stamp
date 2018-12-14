import * as _ from 'lodash';
import { IDescriptorBase, IStamp, InitializerTypeBase } from './types';

/*
    This is a simplified version of example implementation
    https://github.com/stampit-org/stamp-specification/blob/master/compose.js
*/


let isStamp = (arg): arg is IStamp<any, any> => _.isFunction(arg);
let isDescriptor = (arg): arg is IDescriptorBase<any, any> => _.isObject(arg);

function baseComposable(): IDescriptorBase<any, any>{
    return {
        properties:{},
        propertyDescriptors:{},
        deepProperties: {},
        methods:{},
        initializers: []
    }
}

function createStamp<initializerArgType, instanceProps>(descriptor: IDescriptorBase<instanceProps, initializerArgType>){
    let stamp: IStamp<instanceProps, initializerArgType> = Object.assign(((initializerArg: initializerArgType) => {
        let instance: instanceProps = Object.create(descriptor.methods);

        Object.assign(instance, descriptor.properties);
        Object.assign(instance, descriptor.deepProperties);
        Object.defineProperties(instance, descriptor.propertyDescriptors);

        return descriptor.initializers.reduce((initializedInstance, initializer) => {
            initializer.call(instance, initializerArg);
            return instance;
        }, instance);
        
    }), {
        compose: Object.assign((...composables: IDescriptorBase<initializerArgType, instanceProps>[]) => {
            compose.call(this, composables);
        }, descriptor)
    })

    return stamp;
}

function mergeComposables(
    mergedDescriptor:IDescriptorBase<any, any>, src:IDescriptorBase<any, any>
): IDescriptorBase<any, any> {
    
    if (isStamp(src)) src = src.compose;

    Object.assign(mergedDescriptor.properties, src.properties);
    Object.assign(mergedDescriptor.propertyDescriptors, src.propertyDescriptors);
    Object.assign(mergedDescriptor.methods, src.methods);
    _.merge(mergedDescriptor.deepProperties, src.deepProperties);
    return mergedDescriptor;
}

export function compose<initializerArgType, instanceProps>(
    ...composables: Array<IDescriptorBase<instanceProps, initializerArgType> | IStamp<instanceProps, initializerArgType>>
){
    // TODO filter non descriptor | stamps.

    let descriptor = composables.reduce(mergeComposables, baseComposable());
    
    let stamp = createStamp<initializerArgType, instanceProps>(descriptor);

    return stamp;
}