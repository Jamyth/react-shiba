import type { Module } from '../../core/Module';
import type { ActionHandler } from '../../type';

type HandlerDecorator = (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ActionHandler>,
) => TypedPropertyDescriptor<ActionHandler>;

type HandlerInterceptor = (handler: ActionHandler, thisModule: Module<any, any>) => void;

export function createActionHandler(interceptor: HandlerInterceptor): HandlerDecorator {
    return (target, key, descriptor) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- fn is present
        const fn = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            const boundFn: ActionHandler = fn.bind(this, ...args) as any;
            interceptor(boundFn, this as any);
        };

        return descriptor;
    };
}
