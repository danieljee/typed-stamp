import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase, 
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';
import * as http from 'http';
import * as sockjs from 'sockjs';
import { compose } from './compose';

export type ThisType = IProperties & IMethods<IProperties>;

export interface IMethods<thisType> extends IMethodsBase<thisType> {
    _createServer: (this:thisType) => void;
    _connectionHandler: (this:thisType) => void;
    ws_run: (this:thisType) => void;
}

export interface IProperties {
    port: number;
    echo: sockjs.Server;
    http_server: http.Server;
    server_options: any;
}


export interface IDescriptor extends IDescriptorBase {
    initializer: InitializerType;
    properties: IProperties;
    methods: IMethods<ThisType>
}

export interface IInitializerArg extends IInitializerArgBase {
    ws: {
        port: number;
        http_server: http.Server | null;
    }
}

export type InitializerType = InitializerTypeBase<ThisType, IInitializerArg>;

export let descriptor: IDescriptor = {
    initializer(arg){
        this.port = arg.ws.port || 443;
        this.http_server = arg.ws.http_server || http.createServer();
    },
    methods: {
        _createServer() {
            if (!this.http_server) this.http_server = http.createServer();
            this.echo = sockjs.createServer(this.server_options);
            //@ts-ignore
            // this.echo.attach(this.http_server);
        },

        _connectionHandler() {
            console.log('handling connection.');
        },

        ws_run() {
            console.log(`running ws server on port ${this.port}`);
            if (!this.echo) this._createServer();
            this.http_server.listen(this.port);
            this.echo.on('connection', this._connectionHandler);
        },
    },
    properties: {
        server_options: {},
        port: 80,
        echo: null,
        http_server: null
    },
    deepProperties: {}
}

export default compose(descriptor);