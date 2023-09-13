import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { string, object } from "prop-types";
import { Padding } from "../Padding";
import {
  SAMPLE_ID_ELEMENT,
  ORGANISM_DETECTED,
  SAMPLE_TESTING_PROGRAM,
} from "constants/dhis2";
import {
  TextInput,
  RadioInputs,
  SelectInput,
  SwitchInput,
  DateInput,
} from "@hisp-amr/inputs";
// import {getAdmissionDate} from 'api'
import { setEventValue, AddAndSubmit } from "actions";
import * as DUPLICACY from "constants/duplicacy";
import { SdCard } from "@material-ui/icons";
export const DataElement = ({ id }) => {
  const dispatch = useDispatch();
  const optionSets = useSelector((state) => state.metadata.optionSets);
  const completed = useSelector((state) => state.data.event.status.completed);
  var value = useSelector((state) => state.data.event.values[id]);
  const programId = useSelector((state) => state.data.panel.program);
  const sampleDate = useSelector((state) => state.data.panel.sampleDate);
  const calculateDay = useSelector((state) => state.data.calculateDay);
  // const preValues = useSelector(state => state.data.preValues)
  // const objLength = Object.keys(preValues).length
  // if((id === 'GpAu5HjWAEz') && (objLength >0))
  //   {value =preValues.GpAu5HjWAEz}
  const color = useSelector(
    (state) => state.data.event.programStage.dataElements[id].color
  );
  const disabled = useSelector(
    (state) => state.data.event.programStage.dataElements[id].disabled
  );
  const displayFormName = useSelector(
    (state) => state.data.event.programStage.dataElements[id].displayFormName
  );
  const error = useSelector(
    (state) => state.data.event.programStage.dataElements[id].error
  );
  const hide = useSelector(
    (state) => state.data.event.programStage.dataElements[id].hide
  );
  const optionSet = useSelector(
    (state) => state.data.event.programStage.dataElements[id].optionSet
  );
  const optionSetValue = useSelector(
    (state) => state.data.event.programStage.dataElements[id].optionSetValue
  );
  const required = useSelector(
    (state) => state.data.event.programStage.dataElements[id].required
  );
  const valueType = useSelector(
    (state) => state.data.event.programStage.dataElements[id].valueType
  );
  const warning = useSelector(
    (state) => state.data.event.programStage.dataElements[id].warning
  );
  var isCalculatedDays = false;
  // if(displayFormName === "Duration of hospitalization till sample receiving"){
  //     isCalculatedDays= true
  // }

  // const [calculateDayValue, setCalculateDayValue] = useState()
  const duplicate =
    id === SAMPLE_ID_ELEMENT &&
    SAMPLE_TESTING_PROGRAM["0"].value === programId &&
    useSelector((state) => state.data.event.duplicate);

    //  useEffect(()=>{
    //     onChange();
    //  },[])
   
    // useEffect(()=>{
    //     isTrue:true;
    // },[])
    
    
  const onChange = (key, value) => {
    
    if (key === "fihlyDLDikz") {
        // setIsTrue(true);
      let sampleDates = new Date(sampleDate);
      let values = new Date(value);
      const calculateDay = (val, sd) => {
        let difference = sd.getTime() - val.getTime();
        return Math.ceil(difference / (1000 * 3600 * 24));
      };
     
      dispatch(setEventValue(key, value, false));
      //  dispatch(setEventValue('CVMlkTUGzeA', calculateDay(values, sampleDates).toString(),false))
      // setSelectedDate(values);
      dispatch(
        setEventValue(
          "kjzSq1IVpyy",
          calculateDay(values, sampleDates).toString(),
          false
        )
      );
      
    }
    if (key === ORGANISM_DETECTED && value === "Organism growth detected") {
      dispatch(AddAndSubmit(true));
      dispatch(setEventValue(key, value, false));
    }

    // if (
    //   key === "kjzSq1IVpyy" ||
    //   key === "fihlyDLDikz" ||
    //   value === sampleDates
    // ) {
    //   let sampleDates = new Date(sampleDate);
    //   let values = new Date(value);
    //   const calculateDay = (val, sd) => {
    //     let difference = sd.getTime() - val.getTime();
    //     return Math.ceil(difference / (1000 * 3600 * 24));
    //   };
    //   dispatch(setEventValue(key, value, false));
      
    //   dispatch(
    //     setEventValue(
    //       "kjzSq1IVpyy",
    //       calculateDay(values, sampleDates).toString(),
    //       false
    //     )
    //   );
    // }
    // if(key="kjzSq1IVpyy" ){
    //   let sampleDates= selectedDate;
    // let values= new Date(value);
    // const calculateDay1 = (val, sd) => {
    //   let difference = sd.getTime() - val.getTime();
    //   return Math.ceil(difference / (1000 * 3600 * 24));
    // };
    // dispatch(
    //   setEventValue(
    //     "kjzSq1IVpyy",
    //     calculateDay1(values, sampleDates).toString(),
    //     false
    //   )
    // );
    // }
     else {
      dispatch(AddAndSubmit(false));
      dispatch(setEventValue(key, value, false));
    }
  };
  // const onChange = (key, value) => {
  //   if (key === "fihlyDLDikz") {
  //     if (!calculateDayValue) {
  //       // Calculate and store the value if it doesn't exist
  //       let sampleDates = new Date(sampleDate);
  //       let values = new Date(value);
  //       const calculateDay1 = (val, sd) => {
  //             let difference = sd.getTime() - val.getTime();
  //             return Math.ceil(difference / (1000 * 3600 * 24));
  //           };
  //       const calculatedValue1 = calculateDay1(values, sampleDates).toString();
  //       setCalculateDayValue(calculatedValue1); // Use state to store the value
  //       dispatch(setEventValue("kjzSq1IVpyy", calculatedValue1, false));
  //     }
  //      else {
  //       // If the value already exists, use it without recalculation
  //       dispatch(setEventValue("kjzSq1IVpyy", calculateDayValue, false));
  //     }
  //   }
  //   if (key === ORGANISM_DETECTED && value === "Organism growth detected") {
  //         dispatch(AddAndSubmit(true));
  //         dispatch(setEventValue(key, value, false));
  //       }
  //       else {
  //             dispatch(AddAndSubmit(false));
  //             dispatch(setEventValue(key, value, false));
  //           }
   
  // };
  

  if (hide) return null;

  return (
    <Padding>
      {optionSetValue ? (
        optionSets[optionSet].length < 5 ? (
          <RadioInputs
            objects={optionSets[optionSet]}
            name={id}
            label={displayFormName}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled || completed}
          />
        ) : (
          <SelectInput
            objects={optionSets[optionSet]}
            name={id}
            label={displayFormName}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled || completed}
          />
        )
      ) : valueType === "TRUE_ONLY" ? (
        <SwitchInput
          name={id}
          label={displayFormName}
          checked={value}
          onChange={onChange}
          required={required}
          value={value}
          disabled={disabled || completed}
        />
      ) : valueType === "DATE" ? (
        <DateInput
          name={id}
          label={displayFormName}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled || completed}
        />
      ) : (
        <TextInput
          name={id}
          label={displayFormName}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled || completed || isCalculatedDays}
          type={valueType === "NUMBER" ? "number" : "text"}
          color={color}
          unique={id === SAMPLE_ID_ELEMENT}
          error={
            error
              ? error
              : id === SAMPLE_ID_ELEMENT &&
                duplicate === DUPLICACY.DUPLICATE_ERROR
              ? duplicate
              : ""
          }
          warning={
            warning
              ? warning
              : id === SAMPLE_ID_ELEMENT &&
                duplicate === DUPLICACY.DUPLICATE_WARNING
              ? duplicate
              : ""
          }
          loading={
            id === SAMPLE_ID_ELEMENT &&
            duplicate === DUPLICACY.DUPLICATE_CHECKING
              ? true
              : false
          }
        />
      )}
    </Padding>
  );
};

DataElement.propTypes = {
  id: string.isRequired,
};
