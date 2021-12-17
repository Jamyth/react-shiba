import React from 'react';
import type { Module } from './Module';
import type { ModuleLifecycleListener, ModuleBase, Actions } from '../type';

export class ModuleProxy<M extends Module<any, any>> {
    constructor(private module: M, private readonly actions: Actions<M>) {}

    getActions() {
        return this.actions;
    }

    getState() {
        return this.module.useState;
    }

    attachLifecycle<P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> {
        const lifecycleListener = this.module as ModuleLifecycleListener & ModuleBase;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const name = modulePrototype.name as string;

        return class extends React.PureComponent<P> {
            static displayName = `Module[${name}]`;

            override componentDidMount() {
                lifecycleListener.subscribe();
                if (this.hasOwnLifecycle('onTick')) {
                    lifecycleListener.subscribeOnTickLifecycle();
                }
                lifecycleListener.onEnter();
            }

            override componentWillUnmount() {
                lifecycleListener.onDestroy();
                lifecycleListener.unsubscribe();
            }

            private hasOwnLifecycle(key: keyof ModuleLifecycleListener) {
                return Object.prototype.hasOwnProperty.call(modulePrototype, key);
            }

            override render() {
                return <Component {...this.props} />;
            }
        };
    }
}
