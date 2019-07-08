import 'reflect-metadata';
import {DATATYPE} from '../../datatype';
import {MemoryArrayPointer, MemoryPointer} from '../../pointer';
import {Byte, Float, Int32, Short, UByte} from "./native-types";

export function Prop(offset: number, type: DATATYPE = null): PropertyDecorator {
    return (target: any, propKey: string | symbol): any => {
        let props = Reflect.getMetadata('props', target);

        if (!type) {
            let designType = Reflect.getMetadata('design:type', target, propKey);
            if (designType) {
                type = designType;
            }
        }

        if (!props) {
            props = {};
        }

        props[propKey] = {offset, type};
        Reflect.defineMetadata('props', props, target);
    };
}

Prop.int = (offset: number) => Prop(offset, Int32);
Prop.float = (offset: number) => Prop(offset, Float);
Prop.ubyte = (offset: number) => Prop(offset, UByte);
Prop.byte = (offset: number) => Prop(offset, Byte);
Prop.short = (offset: number) => Prop(offset, Short);
Prop.bool = (offset: number) => Prop(offset, Boolean);
Prop.array = (offset: number, Type: any) => Prop(offset, MemoryArrayPointer.of(Type));
Prop.pointer = (offset: number, Type: any) => Prop(offset, MemoryPointer.from(Type));

Prop.define = (type: any = null) => (target: any, propKey: string): any => {
    debugger;
};
