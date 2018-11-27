import { IDescriptor as IDescriptorBase } from './types';

export interface IConfig {
    port: number;
}

export interface IProperties {
    config: IConfig;
}

export interface IDescriptor extends IDescriptorBase {
    properties: IProperties;

}

export let descriptor: IDescriptor = {
    initializer(){},
    methods: {
        setConfig(config: IConfig) {
            this.config = config;
        },
        getConfig() {
            return this.config;
        }
    },
    properties: {
        config: {
            port: 3000
        }
    },
    deepProperties: {}
}

// export default compose(descriptor);