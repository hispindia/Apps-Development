// import { useEffect, useReducer } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { showAlert } from '@hisp-amr/app'
// import { getTEI } from 'api'

// const INITIAL_STATE = {
//     rows: null,
//     loading: true,
//     addButtonDisabled: true,
//     error: false,
// }

// const NEW_PROGRAMS = 'NEW_PROGRAMS'
// const LOADING = 'LOADING'
// const NEW_ROWS = 'NEW_ROWS'
// const EVENTS_ERRORED = 'EVENTS_ERRORED'

// const reducer = (state, action) => {
//     switch (action.type) {
//         case NEW_PROGRAMS: {
//             return {
//                 ...state,
//                 addButtonDisabled: action.disable,
//             }
//         }
//         case LOADING: {
//             return {
//                 ...state,
//                 loading: true,
//             }
//         }
//         case NEW_ROWS: {
//             return {
//                 ...state,
//                 rows: action.rows,
//                 loading: false,
//             }
//         }
//         case EVENTS_ERRORED: {
//             return {
//                 ...state,
//                 rows: action.rows,
//                 error: true,
//             }
//         }
//         default: {
//             return state
//         }
//     }
// }

// export const useEvents = status => {
//     const dispatch = useDispatch()
//     const categories = useSelector(state => state.appConfig.categories)
//     const programList = useSelector(state => state.metadata.programList)
//     const user = useSelector(state => state.metadata.user)
//     const selected = useSelector(state => state.selectedOrgUnit.id)

//     const [state, dispatcher] = useReducer(reducer, INITIAL_STATE)

//     useEffect(() => {
//         const noProgram = !programList.find(p => p.orgUnits.includes(selected))
//         if (noProgram !== state.addButtonDisabled)
//             dispatcher({ type: NEW_PROGRAMS, disable: noProgram })
//     }, [selected, programList, state.addButtonDisabled])

//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const events = await getTEI(selected).then((eventResult) =>
//                                 dispatcher({
//                                 type: NEW_ROWS,
//                                 rows: eventResult,
//                                 })
//                 )

//             } catch (error) {
//                 console.error(error)
//                 dispatcher({ type: EVENTS_ERRORED })
//                 dispatch(showAlert('Failed to get records', { critical: true }))
//             }
//         }

//         dispatcher({ type: LOADING })
//         getData()
//     }, [selected, status, categories, dispatch, user.username])

//     return state
// }

import { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showAlert, followEvent } from "@hisp-amr/app";
// import {  getSterileTEI,getTEI,getPendingSampleResult } from 'api'
import { GP_PROGRAM_ID } from "./constants";
import { createAction } from "@hisp-amr/app/dist/actions/createAction";
import { MARKED_FOLLOW } from "@hisp-amr/app/dist/actions/types";
import {
  getTEIAll,
  getPendingSampleResult,
  getAntibioticFollowTEI,
  getSterileTEI,
  getPendingAntiResult,
} from "api";

const INITIAL_STATE = {
  rows: null,
  loading: true,
  addButtonDisabled: true,
  error: false,
};

const NEW_PROGRAMS = "NEW_PROGRAMS";
const LOADING = "LOADING";
const NEW_ROWS = "NEW_ROWS";
const EVENTS_ERRORED = "EVENTS_ERRORED";

const reducer = (state, action) => {
  switch (action.type) {
    case NEW_PROGRAMS: {
      return {
        ...state,
        addButtonDisabled: action.disable,
      };
    }
    case LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case NEW_ROWS: {
      return {
        ...state,
        rows: action.rows,
        loading: false,
      };
    }
    case EVENTS_ERRORED: {
      return {
        ...state,
        rows: action.rows,
        error: true,
      };
    }
    default: {
      return state;
    }
  }
};

export const useEvents = (status, eventstatus, code, isFollowUp) => {
  var programApi = [];
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.appConfig.categories);
  const programList = useSelector((state) => state.metadata.programList);
  const user = useSelector((state) => state.metadata.user);
  const selected = useSelector((state) => state.selectedOrgUnit.id);
  var isFollowUp = useSelector((state) => state.data.followup);
  const programs = useSelector((state) => state.metadata.programs);
  var userAccess = false;

  programs.forEach((p) => {
    p.programStages.forEach((ps) => {
      userAccess = ps.access.data.write;
    });
  });
  var sampleTestingProgram = programList?.find((element) => {
    var sampleLabel = "Sample testing";
    return element.label === sampleLabel;
  });

  var programApi = []; // Initialize the programApi array

  // if (code == "ST" && sampleTestingProgram) {
  //   programApi = [sampleTestingProgram.value];
  // } else if (code == "GP") {
  //   programApi = GP_PROGRAM_ID;
  // } else if (code == "ALL") {
  //   programApi = []; // Reset programApi before populating it
  //   for (let i = 0; i < programList.length; ++i) {
  //     const item = programList[i];
  //     if (item && item.value && !programApi.includes(item.value)) {
  //       programApi.push(item.value);
  //       console.log("program api====",programApi)
  //     }
  //   }
  // }

  // Ensure programApi is defined and contains the desired values.

  const [state, dispatcher] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const noProgram = !programList.find((p) => p.orgUnits.includes(selected));
    if (noProgram !== state.addButtonDisabled)
      dispatcher({ type: NEW_PROGRAMS, disable: noProgram });
    if (!userAccess) {
      console.log(" User Accesss : ", userAccess);
      dispatcher({ type: NEW_PROGRAMS, disable: !userAccess });
    }
  }, [selected, programList, state.addButtonDisabled]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (eventstatus == "SACTIVE") {
          const eventsSample = await getPendingSampleResult(
            selected,
            programApi,
            eventstatus
          ).then((teiRows) => {
            if (teiRows) {
              dispatcher({
                type: NEW_ROWS,
                rows: teiRows,
              });
            }
          });
        } else if (eventstatus == "ACTIVE") {
          const eventsTei = await getPendingAntiResult(
            selected,
            programApi,
            eventstatus
          ).then((teiRows) => {
            if (teiRows) {
              dispatcher({
                type: NEW_ROWS,
                rows: teiRows,
              });
            }
          });
        } else if (eventstatus == "NotCOMPLETED") {
          const eventsTei = await getAntibioticFollowTEI(
            selected,
            programApi,
            eventstatus
          ).then((teiRows) => {
            if (teiRows) {
              dispatcher({
                type: NEW_ROWS,
                rows: teiRows,
              });
            }
          });
        } else if (eventstatus == "COMPLETED") {
          const eventsData = await getSterileTEI(
            selected,
            programApi,
            eventstatus
          ).then((eventResult) =>
            dispatcher({
              type: NEW_ROWS,
              rows: eventResult,
            })
          );
        } else if (eventstatus == "ALL") {
          const eventsTeiall = await getTEIAll(
            selected,
            programApi,
            eventstatus
          ).then((teiRows) => {
            if (teiRows) {
              dispatcher({
                type: NEW_ROWS,
                rows: teiRows,
              });
            }
          });
        }
      } catch (error) {
        console.error(error);
        dispatcher({ type: EVENTS_ERRORED });
        dispatch(showAlert("Failed to get records", { critical: true }));
      }
    };

    dispatcher({ type: LOADING });
    getData();
  }, [
    selected,
    status,
    categories,
    dispatch,
    user.username,
    eventstatus,
    code,
    isFollowUp,
  ]);

  return state;
};
