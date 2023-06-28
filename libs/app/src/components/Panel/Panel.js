import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Grid } from '@material-ui/core'
import { Padding } from '../Padding'
import { CardSection } from 'components'
import { SelectInput, RadioInputs, DateInput } from '@hisp-amr/inputs'
import { setProgram, setPanelValue } from 'actions'
import { PanelButtons } from './PanelButtons'

/**
 * Contains event panel.
 */
export const Panel = ({ showEdit }) => {
    const entityValid = useSelector(state => state.data.entity.valid)
    const editable = useSelector(state => state.data.editable)
    const previousValues  = useSelector(state => state.data.previousValues)
    const dispatch = useDispatch()
    const { stageLists } = useSelector(state => state.metadata)
    const {
        program,
        programStage,
        organism,
        sampleDate,
        valid,
        programs,
        defaultProgram,
        organisms,
        typeOfIsolate,
        typeOfIsolates,
    } = useSelector(state => state.data.panel)
  
    /**
     * Called when a new program is selected.
     */
    const onProgramChange = async (name, value) =>{
        dispatch(setProgram(value))
    }

    /**
     * Called when something other than program is changed
     */
    const onChange = (name, value) => dispatch(setPanelValue(name, value))

    /**
     * Gets the data elements to be rendered.
     * @returns {Object[]} Data elements.
     */
    const getDataElement = id => {
        const common = {
            disabled: valid,
            required: true,
        }
        switch (id) {
            case `defaultProgram`: 
            return getInput({
                ...common,
                id: 'program',
                name: 'program',
                label: 'Organism group',
                objects: defaultProgram,
                onChange: onProgramChange,
                value: program
            })
            case 'program':
                return getInput({
                    ...common,
                    id: 'program',
                    name: 'program',
                    label: 'Organism group',
                    objects: programs,
                    onChange: onProgramChange,
                    value: program,
                })
            case 'programStage':
                return getInput({
                    ...common,
                    id: 'programStage',
                    name: 'programStage',
                    label: 'Type',
                    objects: stageLists[program],
                    onChange: onChange,
                    value: programStage,
                })
            case 'organism':
                return getInput({
                    ...common,
                    id: 'organism',
                    name: 'organism',
                    label: 'Organism',
                    objects: organisms,
                    onChange: onChange,
                    value: organism,
                })
            case 'sampleDate':
                return getInput({
                    ...common,
                    id: 'sampleDate',
                    name: 'sampleDate',
                    label: 'Date of Sample',
                    onChange: onChange,
                    value: sampleDate,
                })
            case 'typeOfIsolate':
                return getInput({
                    ...common,
                    id: 'typeOfIsolate',
                    name: 'typeOfIsolate',
                    label: 'Type Of Isolate',
                    objects: typeOfIsolates,
                    onChange: onChange,
                    value: typeOfIsolate,
                })
            default:
                return
        }
    }

    /**
     * Gets the input component.
     * @param {Object} dataElement - Data element.
     * @returns {Component} Input component.
     */
    const getInput = dataElement => (
        <Padding key={dataElement.id}>
            {!dataElement.objects ? (
                <DateInput {...dataElement} />
            ) : dataElement.objects.length < 4 ? (
                <RadioInputs {...dataElement} />
            ) : (
                <SelectInput {...dataElement} />
            )}
        </Padding>
    )

    if (!entityValid) return null

    return (
        <CardSection heading="Panel" buttons={showEdit && <PanelButtons />}>
            <Grid container spacing={0}>
                <Grid item xs>
                    { (program=="L7bu48EI54J" || program == "") && !editable ? getDataElement('defaultProgram'): getDataElement('program')}
                    {program &&
                        stageLists[program].length >= 1 &&
                        getDataElement('programStage')}
                </Grid>
                <Grid item xs>
                    {(program && organisms.length) ? program !== "L7bu48EI54J" ? getDataElement('organism') : "" :  ""}
                    {(program && organisms.length) ? program !== "L7bu48EI54J" ? getDataElement('typeOfIsolate') : "" :  ""}
                    {getDataElement('sampleDate')}
                </Grid>
            </Grid>
        </CardSection>
    )
}
