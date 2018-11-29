import { compose } from './compose';
import { descriptor as ws_descriptor, IInitializerArg as ws_IInitializerArg } from './ws_server';
import { descriptor as net_descriptor, IInitializerArg as net_IInitializerArg  } from './net_server';

let stamp = compose<ws_IInitializerArg & net_IInitializerArg>(ws_descriptor, net_descriptor);
let initializerArgs: ws_IInitializerArg & net_IInitializerArg = {
    ws: {
        port: 443,
        http_server: null
    },
    net: {
        port: 3000
    }
}
let instance = stamp(initializerArgs); 

instance.net_run();
instance.ws_run();