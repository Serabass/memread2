export function Param(type: string): ParameterDecorator {
    return (target: any, propertyKey: string | symbol, paramIndex: number) => {
        let data = Reflect.getMetadata('ffi:paramTypes', target, propertyKey);

        if (!data) {
            data = {
                paramIndex,
                type,
            };
        }

        Reflect.defineMetadata('ffi:paramTypes', data, target, propertyKey);
    };
}
