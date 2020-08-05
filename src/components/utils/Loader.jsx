import React from 'react'
import styled from 'styled-components'
import { CircularLoader } from '@dhis2/ui-core'

const Section = styled.section`
                position:fixed;
                top:40%;
                left:50%;
                height:700px;
                width:100%;  
`

export const Loader = () => (
    <Section>
        <CircularLoader />
    </Section>
)

