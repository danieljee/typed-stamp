import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase,
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';
import { compose } from './compose';

type ThisType = IMethods<IProperties> & IProperties;

type ErrorMethods = 'toString';
type ErrorProperties = 'name' | 'message' | 'stack'; 

type ErrorMethodsType = {
    [k in ErrorMethods]: Error[ErrorMethods]
}

type ErrorPropertiesType = {
    [k in ErrorProperties]: Error[ErrorProperties]
}

interface IMethods<thisType> extends IMethodsBase<thisType> {

}

interface IProperties {
    code: number;
    data?: Object;
}

interface IDescriptor extends IDescriptorBase<ThisType> {
    methods: IMethods<ThisType> & ErrorMethodsType;
    properties: IProperties & ErrorPropertiesType
}

export let descriptor: IDescriptor = {
    methods: {
        toString: Error.prototype.toString
    },
    properties: {
        code: 0,
        name: Error.prototype.name,
        message: Error.prototype.message,
        stack: Error.prototype.stack
    }
}
