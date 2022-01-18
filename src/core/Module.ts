import { createSignal } from '@react-rxjs/utils';
import { bind } from '@react-rxjs/core';
import { enableES5, produce } from 'immer';
import { interval } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { matchPath } from 'react-router';
import { HistoryUpdateObserver, history } from './history';
import type { Observable, Subscription } from 'rxjs';
import type { PathParam, Location, StateMode, ModuleLifecycleListener } from '../type';

enableES5();

export class Module<Path extends string, State extends object, HistoryState extends object = any> {
    readonly useState: () => State;
    readonly path: Path | null;
    private readonly observer$: Observable<State>;
    private readonly setter: (state: State) => void;
    private moduleState: State;
    private moduleStateSubscription: Subscription | null;
    private historyStateSubscription: Subscription | null;
    private onTickSubscription: Subscription | null;

    constructor(path: Path | null, initialState: State) {
        const [_observer$, setter] = createSignal<State>();
        const [useState, observer$] = bind(_observer$, initialState);

        this.path = path;
        this.useState = useState;
        this.observer$ = observer$;
        this.setter = setter;
        this.moduleState = initialState;
        this.moduleStateSubscription = null;
        this.historyStateSubscription = null;
        this.onTickSubscription = null;
    }

    onEnter() {
        /**
         * Lifecycle Method
         */
    }

    onLocationMatched(routeParams: PathParam<Path>, location: Location<HistoryState>) {
        /**
         * Lifecycle Method
         */
    }

    onDestroy() {
        /**
         * Lifecycle Method
         */
    }

    onTick() {
        /**
         * Lifecycle Method
         */
    }

    subscribe() {
        this.moduleStateSubscription = this.observer$.subscribe((state) => {
            this.moduleState = state;
        });
        this.historyStateSubscription = HistoryUpdateObserver.pipe(
            map((update) => (this.path ? matchPath(this.path, update.location.pathname) : null)),
            filter((pathMath) => pathMath !== null),
        ).subscribe((pathMatch) => {
            if (pathMatch) {
                const { params } = pathMatch;
                this.onLocationMatched(params as unknown as PathParam<Path>, history.location);
            }
        });
    }

    subscribeOnTickLifecycle() {
        const onTick = (this as ModuleLifecycleListener).onTick;
        const delay = (onTick.tickInterval || 5) * 1000;
        this.onTickSubscription = interval(delay)
            .pipe(startWith(0))
            .subscribe(() => {
                onTick();
            });
    }

    unsubscribe() {
        this.moduleStateSubscription?.unsubscribe();
        this.historyStateSubscription?.unsubscribe();
        this.onTickSubscription?.unsubscribe();
    }

    get state(): State {
        return this.moduleState;
    }

    get observer(): Observable<State> {
        return this.observer$;
    }

    setState(stateOrUpdater: ((state: State) => void) | Partial<State> | State) {
        if (typeof stateOrUpdater === 'function') {
            const originalState = this.state;
            const updater = stateOrUpdater as (state: State) => void;
            const newState = produce<Readonly<State>, State>(originalState, (draftState) => {
                updater(draftState);
            });

            if (newState !== originalState) {
                this.setter(newState);
            }
        } else {
            const newState = stateOrUpdater as object;
            this.setState((state) => Object.assign(state, newState));
        }
    }

    pushHistory(url: string): void;
    pushHistory(url: string, stateMode: StateMode): void;
    pushHistory<T extends object>(url: string, state: T): void;
    pushHistory(state: HistoryState): void;
    pushHistory(urlOrState: HistoryState | string, state?: object | StateMode) {
        if (typeof urlOrState === 'string') {
            const url: string = urlOrState;
            if (state) {
                history.push(url, state === 'keep-state' ? history.location.state : state);
            } else {
                history.push(url);
            }
        } else {
            const location = history.location;
            const currentURL = location.pathname + location.search;
            const state: HistoryState = urlOrState;
            history.push(currentURL, state);
        }
    }
}
