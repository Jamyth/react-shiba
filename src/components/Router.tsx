import React from 'react';
import { useUpdate, history } from '../core/history';
import { Router as ReactRouter } from 'react-router';

interface Props {
    children: React.ReactElement | React.ReactElement[];
}

export const Router = React.memo(({ children }: Props) => {
    const { location } = useUpdate();

    return (
        <ReactRouter navigator={history} location={location}>
            {children}
        </ReactRouter>
    );
});
