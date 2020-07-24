import {MathEx} from "../../math-ex";

export function structSize(type: any) {
    let props: { [key: string]: { offset: number, type: any } } = Reflect.getMetadata('mem:props', type.prototype);
    return MathEx.max(Object.entries(props), ([k, p]) => p.offset);
}
