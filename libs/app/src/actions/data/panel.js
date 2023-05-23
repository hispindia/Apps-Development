import { createAction } from '../createAction'
import { SET_PANEL, SET_PANEL_VALUE, RESET_PANEL,PANEL_EDITABLE } from '../types'
// export const panelEditable = () => dispatch => dispatch(createAction("Editable"))
export const panelEditable = () => dispatch => dispatch(createAction(PANEL_EDITABLE))
export const setPanel = () =>async(dispatch,getState) =>{
    dispatch(createAction(RESET_PANEL_EVENT))
}

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }
    }
}

export const setProgram = program => (dispatch, getState) => {
    const { programOrganisms, optionSets, stageLists } = getState().metadata
    const sampleDate = getState().data.panel.sampleDate;
    const  val = getState().data.previousValues;
    var organisms = []
    optionSets[programOrganisms[program]].forEach(o => {
        if (!organisms.find(org => org.value === o.value)) {
            organisms.push(o)
            organisms.sort(dynamicSort("label"))
        }
    })
    const programStage =stageLists[program].length > 1 ? '' : stageLists[program][0].value
        let valueShow = false 
        if(val && sampleDate){
            if(Object.keys(val).length>0){
                valueShow = true
            }
        }
    dispatch(
        createAction(SET_PANEL, {
            program,
            programStage,
            organism: '',
            sampleDate: valueShow ? sampleDate :"",
            organisms,
            valid: false,
        })
    )
}

export const setPanelValue = (key, value) => (dispatch, getState) => {
    const {
        program,
        programStage,
        organism,
        organisms,
        sampleDate,
    } = getState().data.panel
    const values  = program == "L7bu48EI54J" ? { program, programStage, sampleDate } : { program, programStage, sampleDate, organism }
    if (values[key] === value) return
    const valid = !Object.values({ ...values, [key]: value }).includes('')
    dispatch(
        createAction(SET_PANEL_VALUE, {
            key,
            value,
            valid,
        })
    )
}

export const resetPanel = () => dispatch => dispatch(createAction(RESET_PANEL))
