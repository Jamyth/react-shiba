import { Exception, JavaScriptException } from './Exceptions';
import { setError } from '../state/error';

export function errorToException(error: unknown): Exception {
    if (error instanceof Exception) {
        return error;
    } else {
        let message: string;
        if (!error) {
            message = '[No Message]';
        } else if (typeof error === 'string') {
            message = error;
        } else if (error instanceof Error) {
            message = error.message;
        } else {
            try {
                message = JSON.stringify(error);
            } catch (e) {
                message = '[Unknown]';
            }
        }
        return new JavaScriptException(message, error);
    }
}

export function captureError(error: unknown, action: string): Exception {
    if (process.env.NODE_ENV === 'development') {
        console.error(`[framework] Error captured from [${action}]`, error);
    }
    const exception = errorToException(error);

    setError(exception);

    return exception;
}
