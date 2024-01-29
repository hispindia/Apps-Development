import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  MainSection,
  LoadingSection,
  TitleRow,
  RichButton,
  addSelectedProgramOfOrgUnits,
  CardSection,
  setDataELments,
} from "@hisp-amr/app";
import { Table } from "./Table";
import { useEvents } from "./useEvents";
import { icmr, tanda } from "config";
import { SelectedOrgUnit } from "../../api/programs";
import { DataElements } from "../../api/dataElements";
import Tabs from "./Tabs";
import "./styles.css";
import TabPane from "./Tab-Pane";

import { TABVALUES, SAMPLE_PROGRAM_CODE, PROGRAM_CODE ,PROGRAMS_CODE,PROGRASS_CODE} from "./constants";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
if (!process.env.REACT_APP_DHIS2_TABLE_CONFIG)
  throw new Error(
    "The environment variable REACT_APP_DHIS2_TABLE_CONFIG must be set"
  );

const { titles, headers } = { icmr, tanda }[
  process.env.REACT_APP_DHIS2_TABLE_CONFIG
];

const title = {
  true: "You cannot add records for the selected location",
  false: "Add new record",
};

/**
 * Shows events by status.
 */
export const EventOverview = ({ match, history }) => {
  const status = match.params.status;
  const dispatch = useDispatch();
  const location = useLocation();
  let SAMPLEPROGRAMCODE = SAMPLE_PROGRAM_CODE;
  let PROGRAMCODE = PROGRAM_CODE;

  let PROGRAMSCODE = PROGRAMS_CODE;
  let PROGRAMSSCODE = PROGRASS_CODE;
  const tabValue = TABVALUES;
  var [eventstatus, setEventstatus] = useState("ALL");
  var [code, setCode] = useState("ALL");

  const selected = useSelector((state) => state.selectedOrgUnit);
  const { rows, loading, addButtonDisabled, error } = useEvents(
    status,
    eventstatus,
    code
  );
  // useEffect(() => {
  //   // DataElements.loadDataElements().then(res =>{
  //   //     dispatch(setDataELments(res.dataElements));
  //   // })
  //   SelectedOrgUnit.programs(selected.id).then((res) => {
  //     let selectedProgram = res.programs.filter(
  //       (program) => program.name === "Sample Testing_HP"
  //     );
  //     if (selectedProgram) {
  //       let sampleProgram = [
  //         {
  //           value: "L7bu48EI54J",
  //           label: "Sample Testing",
  //         },
  //       ];
  //       dispatch(addSelectedProgramOfOrgUnits(sampleProgram));
  //     } else {
  //       let sampleProgram = [
  //         {
  //           value: "L7bu48EI54J",
  //           label: "Sample Testing",
  //         },
  //       ];
  //       dispatch(addSelectedProgramOfOrgUnits(sampleProgram));
  //     }
  //   });
  // });

  const handleChange = (returnValue) => {
    var programCode = returnValue[2];
    var programStatus = returnValue[1];
    
    if (programCode == SAMPLEPROGRAMCODE && programStatus == "Spending") {
      setEventstatus("SACTIVE");
      setCode(SAMPLEPROGRAMCODE);
    }
    else if (programCode == PROGRAMSCODE && programStatus == "pending") {
      setEventstatus("ACTIVE");
      setCode(PROGRAMSCODE);
    }
      else if (programCode == PROGRAMCODE && programStatus == "complete") {
      setEventstatus("NotCOMPLETED");
      setCode(PROGRAMCODE);
    } 
    else if (
      programCode == PROGRAMSSCODE &&
      programStatus == "Scomplete"
    ) {
      setEventstatus("COMPLETED");
      setCode(PROGRAMSSCODE);
    }
    else {
      setEventstatus("ALL");
      setCode("ALL");
    }
  };
  /**
   * Called when table row is clicked.
   */
  
  const onEventClick = (row) => {
    
    history.push(`/orgUnit/${row[6]}/trackedEntityInstances/${row[7]}`);
    // location.reload();
    window.location.reload();
  };

  /**
   * On table add click.
   */
  const onAddClick = () => history.push(`/orgUnit/${selected.id}/event/`);
 
  return (
    <MainSection>
      <TitleRow
        // title={titles[status]}
        button={
          <div title={title[addButtonDisabled]}>
            <RichButton
              primary
              large
              icon="add"
              label="Add record"
              disabled={addButtonDisabled}
              onClick={onAddClick}
            />
          </div>
        }
      />
      {/* {!error &&
                (loading ? (
                    <LoadingSection />
                ) : (
                    <Table
                        rows={rows}
                        headers={headers}
                        onEventClick={onEventClick}
                        title={selected.displayName}
                    />
                ))} */}
      <CardSection>
        <Tabs>
          {tabValue.map((tabValues) => (
            <TabPane
              name={tabValues.name}
              tabvalue={tabValues.key}
              onClick={handleChange}
              code={tabValues.code}
            ></TabPane>
          ))}
        </Tabs>
        {!error &&
          (loading ? (
            <LoadingSection />
          ) : (
            <Table
              rows={rows}
              headers={headers}
              onEventClick={onEventClick}
              title={selected.displayName}
              eventStatus={eventstatus}
              code={code}
            />
          ))}
      </CardSection>
    </MainSection>
  );
};
