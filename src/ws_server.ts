import { 
    IDescriptorBase, 
    InitializerTypeBase
} from './types';
import * as http from 'http';
import * as sockjs from 'sockjs';
import { EventEmitter } from 'events';
import { compose } from './compose';
import { is_json_rpc, to_json_rpc } from './utils';

export type ThisType = IProperties & IMethods & EventEmitterType;

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

interface IHandlers {
    [key:string]: Function
}

export interface IInitializerArg {
    ws: {
        port: number;
        http_server: http.Server | null;
    }
}

export interface IProperties {
    port: number;
    echo: sockjs.Server;
    http_server: http.Server;
    server_options?: any;
    handlers?: IHandlers;
}

export interface IMethods {
    create_server: (this:ThisType) => void;
    connection_handler: (this:ThisType, conn) => void;
    ws_run: (this:ThisType) => void;
    add_rpc_handler: (this:ThisType, method: string, handler: Function) => void;
}

export interface IDescriptor extends IDescriptorBase<ThisType, IInitializerArg> {
    properties: IProperties;
    methods: IMethods & EventEmitterType;
}

/**
 * Hack for making sure descriptor does not have extra properties.
 */
type MissingKeysInIDescriptor = Exclude<keyof IDescriptorBase<ThisType, IInitializerArg>, keyof IDescriptor>

type ExtraKeysInIDescriptor = { 
    [K in keyof IDescriptor]: Extract<keyof IDescriptorBase<ThisType, IInitializerArg>, K> extends never ? K : never 
}[keyof IDescriptor];

type VerifyIDescriptor<
    Missing extends never = MissingKeysInIDescriptor,
    Extra extends never = ExtraKeysInIDescriptor
> = 0;

let methods: IMethods = {
    create_server() {
        if (!this.http_server) this.http_server = http.createServer();
        this.echo = sockjs.createServer(this.server_options);
        //@ts-ignore
        this.echo.attach(this.http_server);
    },

    connection_handler(conn: sockjs.Connection) {
        conn.on('data', (data: string) => {
            let payload = JSON.parse(data);
            if (!is_json_rpc(payload)) return conn.write(to_json_rpc(new Error()))
            
            if (this.handlers[payload.method]) this.handlers[payload.method](payload.params);
            else this.emit(payload.method, payload.params); 
        })

        conn.on('close', () => {})
    },

    ws_run() {
        if (!this.echo) this.create_server();
        this.http_server.listen(this.port);
        this.echo.on('connection', this.connection_handler);
    },
    
    add_rpc_handler(method: string, handler: Function) {
        this.handlers[method] = handler;
    }
}

let descriptor: IDescriptor = {
    initializers: [
        function ws_initializer(arg) {
            this.port = arg.ws.port || 443;
            this.http_server = arg.ws.http_server || http.createServer();
        }
    ],
    methods: Object.assign(<EventEmitterType>EventEmitter.prototype, methods),
    properties: {
        server_options: {},
        port: 80,
        echo: null,
        http_server: null
    },
    deepProperties: {}
}

export let stamp = compose(descriptor);