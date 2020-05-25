import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Radio,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  Table,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  updateEventValues,
  validation,
  getProgramRuleChecking,
} from "../../redux/action/event";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";

export const Element = (props) => {
  const dispatch = useDispatch();
  const programStages = useSelector(
    (state) => state.data.dynamicData.programStages
  );
  const programStageSection = useSelector(
    (state) => state.data.programStageSections
  );
  const dataValues = useSelector((state) => state.data.dataValue);
  const programRules = useSelector((state) => state.data.programsRules);
  const Error = useSelector((state) => state.data.Error);
  const errorDataElement = useSelector((state) => state.data.checkingId);
  const payload = useSelector((state) => state.data.payload);
  const element = props.element;
  const values = useSelector((state) => state.data.dataValue[element.id]);
  const hide = useSelector(
    (state) =>
      state.data.programStageSections[
        state.data.programStageSections.dataElementIndex[element.id]
      ].dataElements[element.id].hide
  );
  const onChange = (key, e, valueType) => {
    if (valueType != "DATE") {
      const re = /^[0-9\b]+$/;
      if (
        (valueType === "INTEGER_ZERO_OR_POSITIVE" || valueType === "NUMBER") &&
        !re.test(e.target.value)
      ) {
        dispatch(validation({ id: key, type: true }));
      } else if (
        re.test(e.target.value) &&
        valueType != "INTEGER_ZERO_OR_POSITIVE" &&
        valueType != "NUMBER" &&
        valueType == undefined
      ) {
        dispatch(validation({ id: key, type: true }));
      } else dispatch(validation({ id: null, type: false }));
    }
    let value;
     if(e.target.value ==="true"){
       value=true
     } else if (e.target.value === "false"){
       value=false
     } else{
       value= e.target.value
     }
    dataValues[key] = valueType == "DATE" ? e : value;
    dispatch(updateEventValues(dataValues)); 
    dispatch(
      getProgramRuleChecking(dataValues, programStageSection, programRules)
    );
  };
  if (hide) return null;
  return (
    <Grid item xs={6}>
      <Table>
        <TableRow>
          {element.optionSetValue && element.valueType === "TEXT" ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <select
                  className="form-control"
                  id={element.id}
                  onChange={(e) => onChange(element.id, e)}
                >
                  {element.optionSet.options.map((opt) => (
                    <>
                      <option selected hidden>
                        Please Select Option
                      </option>
                      <option value={opt.code}>{opt.name}</option>
                    </>
                  ))}
                </select>
              </TableCell>
            </>
          ) : null}
        </TableRow>
        <TableRow>
          {element.valueType === "TEXT" && !element.optionSetValue ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <input
                  type="text"
                  id={element.id}
                  className="form-control"
                  placeholder={element.valueType}
                  onChange={(e) => onChange(element.id, e)}
                />
                {Error && errorDataElement === element.id ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    Please Enter text value Only
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
            </>
          ) : null}
        </TableRow>
        <TableRow>
          {element.valueType === "BOOLEAN" ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <RadioGroup row>
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    label="Yes"
                    value="true"
                    onChange={(e) => onChange(element.id, e)}
                    id={element.id}
                  />
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    label="No"
                    value="false"
                    onChange={(e) => onChange(element.id, e)}
                    id={element.id}
                  />
                </RadioGroup>
              </TableCell>
            </>
          ) : (
            ""
          )}

          {element.valueType === "DATE" ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <DatePicker
                  selected={values}
                  onChange={(date) =>
                    onChange(element.id, date, element.valueType)
                  }
                  className="form-control"
                />
              </TableCell>
            </>
          ) : (
            ""
          )}
        </TableRow>
        <TableRow>
          {element.valueType === "TRUE_ONLY" ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <Checkbox
                  color="primary"
                  value="true"
                  id={element.id}
                  onChange={(e) => onChange(element.id, e)}
                />
              </TableCell>
            </>
          ) : (
            ""
          )}
        </TableRow>
        <TableRow>
          {element.valueType === "NUMBER" ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <input
                  type="number"
                  id={element.id}
                  className="form-control"
                  placeholder={element.valueType}
                  onChange={(e) => onChange(element.id, e, element.valueType)}
                />
                {Error && errorDataElement === element.id ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    Please Enter number value Only
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
            </>
          ) : (
            ""
          )}
        </TableRow>
        <TableRow>
          {element.valueType === "INTEGER_ZERO_OR_POSITIVE" ? (
            <>
              <TableCell align="left">
                {element.name}
                {element.required ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell align="right">
                <input
                  type="number"
                  id={element.id}
                  className="form-control"
                  placeholder={element.valueType}
                  onChange={(e) => onChange(element.id, e, element.valueType)}
                />
                {Error && errorDataElement === element.id ? (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    Please Enter number value Only
                  </span>
                ) : (
                  ""
                )}
              </TableCell>
            </>
          ) : (
            ""
          )}
        </TableRow>
      </Table>
    </Grid>
  );
};
