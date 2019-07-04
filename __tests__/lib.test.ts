import {Kernel, PROCESSENTRY32} from "../src/libs/kernel";
import ffi from 'ffi';

describe('lib test', () => {
    it('x', () => {
        const myLib = new Kernel();
        expect(myLib.getProcessId('gta-vc.exe')).toBeGreaterThan(0);
    });
});
