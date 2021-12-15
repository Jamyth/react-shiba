import React from 'react';

/**
 * attention:
 * This hook can only be used in React.
 */

export function useObjectKeyAction<T extends object, K extends keyof T>(action: (field: T) => void, key: K) {
    return React.useCallback(
        (value: T[K]) => {
            action({ [key]: value } as T);
        },
        [action, key],
    );
}
