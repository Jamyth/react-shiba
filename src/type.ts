import type { Location as HistoryLocation } from 'history';
import type { Module } from './core/Module';

export type Location<S> = Omit<HistoryLocation, 'state'> & {
    state: Readonly<S> | undefined;
};

export type StateMode = 'keep-state';

export type ActionHandler = (...args: any[]) => void;

export type HandlerKeys<M> = { [K in keyof M]: M[K] extends (...args: any[]) => void ? K : never }[Exclude<
    keyof M,
    keyof ModuleLifecycleListener | keyof ModuleBase
>];
export type Actions<M extends Module<any, any>> = { readonly [Key in HandlerKeys<M>]: M[Key] };

export type PathParam<S extends string> = string extends S
    ? { [key: string]: string | number }
    : S extends `${infer _}/:${infer Param}/${infer Rest}`
    ? { [Key in Param | keyof PathParam<Rest>]: string | number }
    : S extends `${infer _}/:${infer Param}`
    ? { [Key in Param]: string | number }
    : object;

export interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}

export interface ModuleBase<
    ModuleState extends object = object,
    Path extends string = string,
    HistoryState extends object = object,
> {
    path: Path | null;
    setState(state: ModuleState): void;
    useState(): ModuleState;
    subscribe(): void;
    subscribeOnTickLifecycle(): void;
    unsubscribe(): void;
    pushHistory: (urlOrState: HistoryState | string, state?: object | StateMode) => void;
}

export interface ModuleLifecycleListener<Path extends string = string, HistoryState extends object = object> {
    onEnter: () => void;
    onLocationMatched(routeParams: PathParam<Path>, location: Location<HistoryState>): void;
    onDestroy: () => void;
    onTick: (() => void) & TickIntervalDecoratorFlag;
}
