import styled from 'styled-components'
import { MenuItem, colors } from '@dhis2/ui-core'

export const StyledMenuItem = styled(MenuItem)`
    .link {
        padding-right: 2px;
    }
    .label {
        width: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`
export const Count = styled.span`
    padding: 2px;
    background: ${colors.grey300};
    border-radius: 2px;
    margin-left: 4px;
`
