
export function mixin<Dest, Src>(dest: Dest, src: Src){
    Object.getOwnPropertyNames(src).forEach(name => {
        Object.defineProperty(dest, name, Object.getOwnPropertyDescriptor(src, name));
    })   
}