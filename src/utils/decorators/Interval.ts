import type { TickIntervalDecoratorFlag } from '../../type';

type ActionHandler = (...args: any[]) => any;

type OnTickHandlerDecorator = (
    target: object,
    propertyKey: 'onTick',
    descriptor: TypedPropertyDescriptor<ActionHandler & TickIntervalDecoratorFlag>,
) => TypedPropertyDescriptor<ActionHandler>;

export function Interval(second: number): OnTickHandlerDecorator {
    return (target, propertyKey, descriptor) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- onTick function is present
        descriptor.value!.tickInterval = second;
        return descriptor;
    };
}
