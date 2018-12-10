import { IJsonRpc } from '../types';

export function is_json_rpc(payload: any): payload is IJsonRpc  {
    return (payload.jsonrpc && payload.method && payload.params && payload.id)
}

export function to_json_rpc(data) {
    return JSON.stringify(data);
}
