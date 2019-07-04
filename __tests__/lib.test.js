"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("../src/lib");
describe('lib test', function () {
    it('x', function () {
        var myLib = new lib_1.Kernel();
        // let res = myLib.MessageBox(0, 'asd', 'dsa', 0);
        expect(myLib).toBeDefined();
    });
});
