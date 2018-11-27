export interface IDescriptor {
    methods?: Object;
    properties?: Object;
    deepProperties?: Object;
    propertyDescriptors?: Object;
    staticProperties?: Object;
    staticDeepProperties?: Object;
    staticPropertyDescriptors?: Object;
    initializer?: Function;
    composers?: Function[];
    configuration?: Object;
    deepConfiguration?: Object;
}