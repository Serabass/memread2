export class MemoryPointer {

    public static from(cls: any) {
        return new MemoryPointer(cls);
    }

    constructor(public cls: any) {

    }
}

export class MemoryArrayPointer {

    public static of(cls: any) {
        return new MemoryArrayPointer(cls);
    }
    constructor(public cls: any) {

    }
}
