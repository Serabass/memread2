import {IMethodOptions, Method as _Method, never} from "ffi-decorators";

export { Library } from 'ffi-decorators';

export function Method(options: IMethodOptions) {
    return (target: any, propertyKey: string) => {
        target[propertyKey] = () => never();
        let descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey);

        if (!descriptor) {
            return;
        }
        _Method(options)(target, propertyKey, descriptor);
    };
}
