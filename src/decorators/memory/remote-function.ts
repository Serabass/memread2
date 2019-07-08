// https://stackoverflow.com/questions/28795242/injecting-only-function-and-running-it-through-createremotethread-c
// http://www.cyberforum.ru/csharp-beginners/thread1974282.html
import 'reflect-metadata';
import {AllocationInfo, Injector} from "../../injector";
import {kernel, WFSO} from "../../libs";
import {Process} from "../../process";

export function RemoteFunction(cb: (injector: Injector) => AllocationInfo): PropertyDecorator {
    return (target, propertyKey: string | symbol) => {

        target[propertyKey] = () => {
            let inj = new Injector();
            let alloc = cb(inj);
            Process.instance.writeAlloc(alloc);
            let aa = Buffer.alloc(5);
            kernel.CreateRemoteThread(Process.instance.handle, null,
                0, alloc.address, alloc.address, 0, aa);

            kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);
        };
    };
}
