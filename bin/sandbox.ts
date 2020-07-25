import {AllocationInfo} from "../src/allocation-info";
import {Game} from "../src/entities";
import {TaxiCab} from "../src/entities/taxi-cab";
import {Injector} from "../src/injector";
import {Process} from "../src/process";

Process.instance.open();

TaxiCab.create({
    x: -1038.88,
    y: -897.25,
    z: 13.70,
    a: 55.4
}, {
    x: -931.60,
    y: -1033.20,
    z: 14.28,
    a: 155.4
});

debugger;
