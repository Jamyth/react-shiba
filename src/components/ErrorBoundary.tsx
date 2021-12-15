import React from 'react';
import { captureError } from '../utils/captureError';
import type { Exception } from '../utils/Exceptions';

interface Props {
    render: (exception: Exception) => React.ReactElement | null;
}

interface State {
    exception: Exception | null;
}

export class ErrorBoundary extends React.PureComponent<Props, State> {
    static defaultProps: Pick<Props, 'render'> = { render: () => null };

    constructor(props: Props) {
        super(props);
        this.state = { exception: null };
    }

    override componentDidCatch(error: Error) {
        const exception = captureError(error, '@@react-shiba/error-boundary');
        this.setState({ exception });
    }

    render() {
        return this.state.exception ? this.props.render(this.state.exception) : this.props.children || null;
    }
}
