import { createSignal } from '@react-rxjs/utils';
import { bind } from '@react-rxjs/core';
import type { Exception } from '../utils/Exceptions';

const [_observer$, setError] = createSignal<Exception | null>();
const [useErrorState, errorObserver$] = bind(_observer$, null);

export { errorObserver$ as errorObserver, useErrorState, setError };
