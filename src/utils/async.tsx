import React from 'react';

type ReactComponentKeyOf<T> = { [P in keyof T]: T[P] extends React.ComponentType ? P : never }[keyof T];

type AsyncOptions = {
    loadingIdentifier?: string;
    LoadingComponent?: React.ComponentType;
    ErrorComponent?: React.ComponentType<AsyncErrorComponentProps>;
};

interface State {
    Component: React.ComponentType<any> | null;
    error: unknown | null;
}

export interface AsyncErrorComponentProps {
    error: unknown;
    reload: () => Promise<void>;
}

export function async<T, K extends ReactComponentKeyOf<T>>(
    resolve: () => Promise<T>,
    componentKey: K,
    { loadingIdentifier, LoadingComponent, ErrorComponent }: AsyncOptions = {},
): T[K] {
    return class extends React.PureComponent<any, State> {
        constructor(props: object) {
            super(props);
            this.state = {
                Component: null,
                error: null,
            };
        }

        override componentDidMount() {
            this.loadComponent();
        }

        loadComponent = async () => {
            try {
                this.setState({ error: null });
                // TODO:loading
                const moduleComponent: T = await resolve();
                this.setState({ Component: moduleComponent[componentKey] as any });
            } catch (error) {
                this.setState({ error });
            } finally {
                // TODO:loading
            }
        };

        override render() {
            const { Component, error } = this.state;
            const hasError = error !== null;

            if (hasError) {
                return ErrorComponent ? <ErrorComponent error={error} reload={this.loadComponent} /> : null;
            }

            return Component ? <Component /> : LoadingComponent ? <LoadingComponent /> : null;
        }
    } as any;
}
