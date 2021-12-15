import { createBrowserHistory } from 'history';
import { bind } from '@react-rxjs/core';
import { createSignal } from '@react-rxjs/utils';
import type { Update } from 'history';

const history = createBrowserHistory();
const [update$, setUpdate] = createSignal<Update>();

history.listen(setUpdate);

const [useUpdate, historyUpdate$] = bind(update$, { action: history.action, location: history.location });

export { history, historyUpdate$ as HistoryUpdateObserver, useUpdate };
