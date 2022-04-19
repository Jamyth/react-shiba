import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorHandler } from '../utils/ErrorHandler';
import { errorObserver } from '../state/error';
import { filter } from 'rxjs/operators';
import { Exception } from '../utils/Exceptions';
import { Router } from '../components/Router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { captureError } from '../utils/captureError';

interface AppOptions {
    Component: React.ComponentType<any>;
    errorHandler: ErrorHandler;
    entryElement?: HTMLElement | null;
}

interface ApplicationProps {
    component: React.ComponentType<any>;
}

function createElement() {
    const div = document.createElement('div');
    div.id = 'app';

    document.body.appendChild(div);

    return div;
}

function Application({ component: Component }: ApplicationProps) {
    return (
        <ErrorBoundary>
            <Router>
                <Component />
            </Router>
        </ErrorBoundary>
    );
}

function setGlobalErrorHandler() {
    window.addEventListener(
        'error',
        (event) => {
            try {
                const analyzeByTarget = (): string => {
                    if (event.target && event.target !== window) {
                        const element = event.target as HTMLElement;
                        return `DOM source error: ${element.outerHTML}`;
                    }
                    return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
                };
                captureError(event.error || event.message || analyzeByTarget(), '@@global/error-handler');
            } catch (e) {
                console.error('[framework]: global error handler');
            }
        },
        true,
    );
    window.addEventListener(
        'unhandledrejection',
        (e) => {
            try {
                captureError(e.reason, '@@global/unhandled-rejection');
            } catch (error) {
                console.error('[framework]: global unhandled rejection handler');
            }
        },
        true,
    );
}

export function createApp({ Component, entryElement, errorHandler }: AppOptions) {
    const element = entryElement || createElement();

    ReactDOM.createRoot(element).render(<Application component={Component} />);

    errorObserver
        .pipe(filter((exceptionOrNull): exceptionOrNull is Exception => exceptionOrNull !== null))
        .subscribe((exception) => {
            errorHandler.onError(exception);
        });

    setGlobalErrorHandler();
}
