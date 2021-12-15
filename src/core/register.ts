import { ModuleProxy } from './ModuleProxy';
import { captureError } from '../utils/captureError';
import type { Module } from './Module';

export function register<M extends Module<any, any>>(module: M) {
    const actions: any = {};
    getKeys(module).forEach((actionName) => {
        const action = module[actionName];
        actions[actionName] = executeAction(action.bind(module), actionName);
    });

    return new ModuleProxy(module, actions);
}

function executeAction<Args extends any[]>(action: (...args: Args) => void, actionName: string) {
    return async (...args: Args) => {
        try {
            await action(...args);
        } catch (error) {
            captureError(error, actionName);
        }
    };
}

function getKeys<M extends Module<any, any>>(module: M) {
    const keys: string[] = [];
    for (const propertyKey of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
        if (module[propertyKey] instanceof Function && propertyKey !== 'constructor') {
            keys.push(propertyKey);
        }
    }
    return keys;
}
