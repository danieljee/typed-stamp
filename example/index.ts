import { compose } from '../src/compose';

import { 
    stamp as ws_stamp, 
    IInitializerArg as ws_IInitializerArg,
    ThisType as ws_ThisType
 } from '../src/ws_server';

import { 
    stamp as net_stamp, 
    IInitializerArg as net_IInitializerArg,
    ThisType as net_ThisType
} from '../src/net_server';

type ThisType = ws_ThisType & net_ThisType

let stamp = compose<ws_IInitializerArg & net_IInitializerArg, ThisType>(ws_descriptor, net_descriptor);
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