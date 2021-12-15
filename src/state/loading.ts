import { createSignal } from '@react-rxjs/utils';
import { bind } from '@react-rxjs/core';

let loadingState: Record<string, boolean> = {};
const [_observer$, setLoadingState] = createSignal<Record<string, boolean>>();
const [useLoadingState, loadingObserver$] = bind(_observer$, loadingState);

loadingObserver$.subscribe((state) => (loadingState = state));

function useLoading(key: string = 'default') {
    const state = useLoadingState();
    return state[key];
}

function setLoading(key: string = 'default', status: boolean = true) {
    setLoadingState({
        ...loadingState,
        [key]: status,
    });
}

export { loadingObserver$ as loadingObserver, useLoading, setLoading, setLoadingState };
