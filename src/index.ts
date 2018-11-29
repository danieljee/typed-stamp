import { compose } from './compose';
import { 
    descriptor as ws_descriptor, 
    IInitializerArg as ws_IInitializerArg,
    ThisType as ws_ThisType
 } from './ws_server';
import { 
    descriptor as net_descriptor, 
    IInitializerArg as net_IInitializerArg,
    ThisType as net_ThisType
} from './net_server';

let stamp = compose<ws_IInitializerArg & net_IInitializerArg, ws_ThisType & net_ThisType>(ws_descriptor, net_descriptor);
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

instance.ws_run();
instance.net_run();