import {Player} from "./entities";

let car = Player.instance.getCar();
console.log(car.baseAddress.toString(16));
car.fix();
