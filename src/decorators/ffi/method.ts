import {IMethodOptions, Method as _Method, never} from "ffi-decorators";

export { Library } from 'ffi-decorators';

export function Method(options?: Partial<IMethodOptions>) {
    return (target: any, propertyKey: string) => {
        if (!options) {
            options = {};
        }

        if (!options.types) {
            let returnType = Reflect.getMetadata('ffi::returnType', target, propertyKey);
            let paramTypes = Reflect.getMetadata('ffi::paramTypes', target, propertyKey) || [];


            if (!returnType) {
                throw new Error(`Return type is required [${target}, ${propertyKey}]`);
            }

            options.types = [returnType, paramTypes];
        }

        target[propertyKey] = () => never();
        let descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey);

        if (!descriptor) {
            return;
        }

        _Method(options as IMethodOptions)(target, propertyKey, descriptor);
    };
}

export function Ret(type: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata('ffi::returnType', type, target, propertyKey);
    };
}

Ret.bool = () => Ret('bool');
Ret.int = () => Ret('int');
Ret.short = () => Ret('short');

export function Params(...types: string[]) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata('ffi::paramTypes', types, target, propertyKey);
    };
}
