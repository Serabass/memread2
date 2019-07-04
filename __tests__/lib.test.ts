import {Kernel} from "../src/lib";

describe('lib test', () => {
    it('x', () => {
        const myLib = new Kernel();
        // let res = myLib.MessageBox(0, 'asd', 'dsa', 0);
        expect(myLib).toBeDefined();
    });
});
