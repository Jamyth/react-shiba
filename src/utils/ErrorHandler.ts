import type { Exception } from './Exceptions';

export abstract class ErrorHandler {
    abstract onError(exception: Exception): void;
}
