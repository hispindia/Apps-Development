import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Grid,
} from "@material-ui/core";
import { DataElement } from "./DataElement";
import { NavLink  } from "react-router-dom";
import { useHistory } from "react-router";
export const Sections = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const programStageSections = useSelector(
    (state) => state.data.programStageSections
  );
  const btnStatus = useSelector((state) => state.data.btnStatus);
  const goStatus = useSelector((state) => state.data.mandatoryElement);
  const onGO = () =>{
    history.push("/trackedEntityInstances")
  }
  if (programStageSections === undefined) return null;
  else {
    return (
      <>
        <Grid>
          {programStageSections
            .filter((ps) => !ps.hide)
            .map((programStageSection) => {
              if (programStageSection)
                return (
                  <>
                    <DataElement programStageSection={programStageSection} />
                  </>
                );
            })}
          {btnStatus ? (
            <div className="float-right">
              {/* <NavLink className="nav-link" to="/trackedEntityInstances"> */}
                <Button
                  variant="contained"
                  raised
                  color="primary"
                  disabled={!goStatus}
                  onClick={(e) => onGO(e)}
                >
                  Go
                </Button>
              {/* </NavLink> */}
            </div>
          ) : (
            ""
          )}
        </Grid>
      </>
    );
  }
};
