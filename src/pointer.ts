export class MemoryPointer {
    public static from(cls: Function) {
        return new MemoryPointer(cls);
    }

    constructor(public cls: Function) {

    }
}

export class MemoryArrayPointer {
    public static of(cls: Function) {
        return new MemoryArrayPointer(cls);
    }

    constructor(public cls: Function) {

    }
}