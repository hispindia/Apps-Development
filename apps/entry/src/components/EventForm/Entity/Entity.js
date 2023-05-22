import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { bool } from 'prop-types'
import { Grid } from '@material-ui/core'
import { CardSection, LoadingSection } from '@hisp-amr/app'
import { EntityButtons } from './EntityButtons'
import { EntityModal } from './EntityModal'
import { EntityInput } from './EntityInput'

/**
 * Entity information section.
 */
export const Entity = ({ showEdit }) => {

    const entityValid = useSelector(state => state.data.entity.valid)
    const { person } = useSelector(state => state.metadata)
    const id = useSelector(state => state.data.entity.id)
    const attributes = useSelector(state => state.data.entity.attributes)
    const editing = useSelector(state => state.data.entity.editing)
    const programs = useSelector(state => state.metadata.programs)
    var userAccess = false;

    programs.forEach(p => {
        p.programStages.forEach(ps => {
            userAccess = ps.access.data.write
        })
    })

    const [half] = useState(
        Math.floor(person.trackedEntityTypeAttributes.length / 2)
    )

    if (!attributes) return <LoadingSection />

    return (
        <CardSection
            heading="Person"
            buttons={userAccess && <EntityButtons entityValid={entityValid} showEdit={showEdit} id={id}/>}
        >
            <EntityModal />
            <Grid container spacing={0}>
                <Grid item xs>
                    {attributes.slice(0, half).map(a => (
                        <EntityInput
                            attribute={a}
                            key={a.trackedEntityAttribute.id}
                        />
                    ))}
                </Grid>
                <Grid item xs>
                    {attributes.slice(half).map(a => (
                        <EntityInput
                            attribute={a}
                            key={a.trackedEntityAttribute.id}
                        />
                    ))}
                </Grid>
            </Grid>
        </CardSection>
    )
}

Entity.prototypes = { showEdit: bool }
