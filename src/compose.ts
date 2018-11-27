import { IDescriptor } from './types';

function createStamp(descriptor: IDescriptor){
    return function factory(initializerArg){
        let instance = Object.create(descriptor.methods);

        Object.assign(instance, descriptor.properties);
        Object.assign(instance, descriptor.deepProperties);
    }
}

export function compose(...composables: IDescriptor[]){

}