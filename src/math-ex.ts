type MathExCallback<T> = (el: T) => number;

export class MathEx {
    public static sum<T = number>(arr: T[], cb: MathExCallback<T> = (el) => el as unknown as number) {
        return arr.reduce<number>((a, b) => {
            return a + cb(b);
        }, 0);
    }

    public static max<T = number>(arr: T[], cb: MathExCallback<T> = (el) => el as unknown as number) {
        return arr.reduce<number>((a, b) => {
            return Math.max(a, cb(b));
        }, 0);
    }

    public static avg<T = number>(arr: T[], cb: MathExCallback<T> = (el) => el as unknown as number) {
        // arr = arr.filter((el) => cb(el) !== 0);
        return this.sum<T>(arr, cb) / arr.length;
    }
}
