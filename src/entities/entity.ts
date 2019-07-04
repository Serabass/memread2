export class Entity {
    constructor(protected baseAddress: number) {

    }

    public toString(): string {
        return `${(this.constructor as any).name}@0x${this.baseAddress.toString(16)}`;
    }
}
