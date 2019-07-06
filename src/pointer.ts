export class MemoryPointer {
    constructor(public cls: Function) {

    }

    public static from(cls: Function) {
        return new MemoryPointer(cls);
    }
}

export class MemoryArrayPointer {
    constructor(public cls: Function) {

    }

    public static of(cls: Function) {
        return new MemoryArrayPointer(cls);
    }
}
