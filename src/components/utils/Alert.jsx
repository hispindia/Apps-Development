import React from 'react';
import { AlertBar, AlertStack } from '@dhis2/ui-core';

export const Alert = (props) => {
    const { message, success, warning, critical, handleErrors } = props;

    return (
        <AlertStack>
            <AlertBar
                success={success}
                warning={warning}
                critical={critical}                
                onHidden={handleErrors}
            >
                {message}
            </AlertBar>
        </AlertStack>
    )
}
