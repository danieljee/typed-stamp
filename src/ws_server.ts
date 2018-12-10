import { 
    IDescriptor as IDescriptorBase, 
    IMethods as IMethodsBase, 
    IInitializerArg as IInitializerArgBase,
    InitializerType as InitializerTypeBase
} from './types';
import * as http from 'http';
import * as sockjs from 'sockjs';
import { EventEmitter } from 'events';
import { compose } from './compose';
import { is_json_rpc, to_json_rpc } from './utils';

export type ThisType = IProperties & IMethods<IProperties> & EventEmitterType;

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

export interface IDescriptor<thisType> extends IDescriptorBase<thisType> {
    initializer: InitializerTypeBase<thisType, IInitializerArg>;
    properties: IProperties;
    methods: IMethods<thisType> & EventEmitterType
}

export interface IMethods<thisType> {
    create_server: (this:thisType) => void;
    connection_handler: (this:thisType, conn) => void;
    ws_run: (this:thisType) => void;
    conn_close_handler: (this:thisType) => void;
    add_rpc_handler: (this:thisType, method: string, handler: Function) => void;
}

export interface IProperties {
    port: number;
    echo: sockjs.Server;
    http_server: http.Server;
    server_options?: any;
    _connection_handler?: Function;
    handlers?: IHandlers;
}

export interface IInitializerArg extends IInitializerArgBase {
    ws: {
        port: number;
        http_server: http.Server | null;
    }
}

/*
    TODO
    Find a way to enforce properties on thisType to be defined before use.
    E.g.
    initializer(arg){
        this.undefined_property(); // Not allowed.
    }
     
*/

let methods: IMethods<ThisType> = {
    create_server() {
        if (!this.http_server) this.http_server = http.createServer();
        this.echo = sockjs.createServer(this.server_options);
        //@ts-ignore
        // this.echo.attach(this.http_server);
        
    },

    /**
     * Handles messages in json rpc format
     * If handlers are not found for the method,
     * event is emitted and method name is used as event name.
     * Therefore listeners can be assigned to handle messages.
     * @param conn 
     */
    connection_handler(conn: sockjs.Connection) {
        conn.on('data', (data: string) => {
            let payload = JSON.parse(data);
            if (!is_json_rpc(payload)) return conn.write(to_json_rpc(new Error()))
            
            if (this.handlers[payload.method]) this.handlers[payload.method](payload.params);
            else this.emit(payload.method, payload.params); 
        })

        conn.on('close', this.conn_close_handler)
    },

    conn_close_handler() {

    },

    ws_run() {
        console.log(`running ws server on port ${this.port}`);
        if (!this.echo) this.create_server();
        this.http_server.listen(this.port);
        this.echo.on('connection', this._connection_handler);
    },
    
    add_rpc_handler(method: string, handler: Function) {

    }
}

export let descriptor: IDescriptor<ThisType> = {
    initializer(arg){
        this.port = arg.ws.port || 443;
        this.http_server = arg.ws.http_server || http.createServer();
    },
    methods: Object.assign(<EventEmitterType>EventEmitter.prototype, methods),
    properties: {
        server_options: {},
        port: 80,
        echo: null,
        http_server: null
    },
    deepProperties: {}
}

export default compose(descriptor);