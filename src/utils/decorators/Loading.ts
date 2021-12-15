import { setLoading } from '../../state/loading';
import { createActionHandler } from './createActionHandler';

export function Loading(key: string = 'default') {
    return createActionHandler(async (handler) => {
        try {
            setLoading(key);
            await handler();
        } finally {
            setLoading(key, false);
        }
    });
}
