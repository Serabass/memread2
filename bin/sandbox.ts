import {structSize} from "../src/decorators/memory/struct-size";
import {Vector3d} from "../src/entities";


function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}
clear();

console.log(structSize(Vector3d));
