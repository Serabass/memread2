// https://stackoverflow.com/questions/28795242/injecting-only-function-and-running-it-through-createremotethread-c
// http://www.cyberforum.ru/csharp-beginners/thread1974282.html

export function RemoteFunction(): PropertyDecorator {
    return function(target, propertyKey: string | symbol) {
        // debugger;
    };
}
