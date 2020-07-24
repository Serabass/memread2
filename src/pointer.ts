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

export class MemoryArray {

    public static of(cls: any, count: number, size: number) {
        return new MemoryArray(cls, count, size);
    }

    constructor(public cls: any, public count: number, public  size: number) {

    }
}
