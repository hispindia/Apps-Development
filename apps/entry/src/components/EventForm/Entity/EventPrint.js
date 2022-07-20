import React, { useRef, useEffect, useState } from "react";

import { useReactToPrint } from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import moment from "moment";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  Typography,
} from "@material-ui/core";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@mui/styles";
import {
  SAMPLE_TYPEID,
  PATHOGEN_POSITIVE,
  PATHOGEN_NEGATIVE,
  CR_NUMBER,
  LAB_ID,
  LOCATION,
  DEPARTMENT,
  PATIENT_OUTCOME,
  NAME,
  SAMPLE_DATE,
  REGISTRATION_DATE,
  SAMPLE_TYPE,
  GENDER,
  AGE,
  PATHOGEN_G,
  PATHOGEN,
  AST,
  NOTES,
} from "./constants";
import "./print.css";

const commonStyles = {
  bgcolor: "background.paper",
  m: 1,
  borderColor: "text.primary",
  width: "5rem",
  height: "5rem",
};

const useStyles = makeStyles({
  root: {},
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
});

export default function EventPrint(props) {
  const classes = useStyles();
  var entityValues = useSelector((state) => state.data.entity.values);
  // var programs = useSelector((state) => state.metadata.programs);
  var events = useSelector((state) => state.data.eventList);
  const dataElements = useSelector((state) => state.data.dataElements);
  const dataElementObjects = useSelector((state) => state.metadata.dataElementObjects);
  const [open, setOpen] = React.useState(true);
  const ref = useRef();
  const eventId = localStorage.getItem("eventId");
  let dateElements = Object.values(dataElementObjects);
  let obj = {
    "Hospital department": "",
    "Lab ID": "",
    Pathogen: "",
    "Patient Location": "",
    "Sample type": "",
    EventDate: "",
    "AMR ID": "",
    Organism: "",
    dataValue: [],
    "Reg Date":""
  };
  let eventOne = events.filter((ev) => ev.event == eventId);
  eventOne.forEach((event) => {
    if (event.status == "COMPLETED") {
      let arr = [];
      // let program = programs.filter((p) => p.id == event.program);
      obj["EventDate"] = event.eventDate.split("T")[0];
      // obj["program"] = program[0].name;
      obj["Reg Date"]= event.created.split("T")[0]
      event.dataValues.forEach((dv) => {
        let deObj = dateElements.filter((de) => {
          if (de.id == dv.dataElement) {
              de["value"] = dv.value;
              return de;
          }
        });
        if (
          deObj[0].id != "B7XuDaXPv10" &&
          deObj[0].id != "GpAu5HjWAEz" &&
          deObj[0].id != "mp5MeJ2dFQz" &&
          deObj[0].id != "dRKIjwIDab4" &&
          deObj[0].id != "SaQe2REkGVw" &&
          deObj[0].id != "dRKIjwIDab4" &&
          deObj[0].id != "lIkk661BLpG"
        ) {
          arr.push(deObj[0]);
        }
        if (dv.dataElement == "B7XuDaXPv10") {
          obj["Patient Location"] = dv.value;
        }
        if (dv.dataElement == "dRKIjwIDab4") {
          obj["Hospital department"] = dv.value;
        }
        if (dv.dataElement == "GpAu5HjWAEz") {
          obj["Lab ID"] = dv.value;
        }
        if (dv.dataElement == "mp5MeJ2dFQz") {
          obj["Sample type"] = dv.value;
        }
        if (dv.dataElement == "dRKIjwIDab4") {
          obj["Hospital department"] = dv.value;
        }
        if (dv.dataElement == "SaQe2REkGVw") {
          let dele= dataElements.filter(de=>de.code == dv.value)
          obj["Organism"] = dele[0].name;
        }
        if (dv.dataElement == "lIkk661BLpG") {
          obj["AMR ID"] = dv.value;
        }
      });
      let oarr=[]
       for(let ele of arr){
        let val = parseInt(ele.value)
        let isNumber = Number.isInteger(val)
         if(!isNumber){
          oarr.push(ele)
         }
       }
      obj["dataValue"] = oarr;
    }
  });
  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => handleClose(),
  });
  const handleClose = () => {
    setOpen(false);
    props.onPrint(false)
  };
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogContent dividers ref={ref}>
        <Grid container>
          <Grid>
            <span
              style={{
                padding: "15px",
                marginLeft: "100px",
                marginRight: "150px",
                fontWeight: "bold",
              }}
            >
              Microbiology Laboratory Report Form{" "}
            </span>
          </Grid>
        </Grid>
        <Box sx={{ border: "1px solid black", fontSize: 12, m: 1 }}>
          <Box sx={{ border: 2, fontSize: 12, ml: 6, mr: 6, mt: 1, mb: 1 }}>
            <Table
              sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}
            >
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {CR_NUMBER} :&nbsp;&nbsp;&nbsp;&nbsp;
                        {entityValues["nFrlz82c6jS"]}
                      </Box>
                    </Typography>
                  </TableCell>

                  <TableCell style={{ width: "40%", textAlign: "center" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {NAME} :&nbsp;&nbsp;&nbsp;&nbsp;
                        {entityValues["D6QGzhnkKOW"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%", textAlign: "right" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {REGISTRATION_DATE} :&nbsp;&nbsp;&nbsp;&nbsp;
                        {moment(obj["Reg Date"]).format(
                          "DD/MM/yyyy"
                        )}
                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {GENDER} :&nbsp;&nbsp;&nbsp;&nbsp;
                        {entityValues["VXRRpqAdrdK"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%", textAlign: "center" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {AGE} :&nbsp;&nbsp;&nbsp;&nbsp;
                        {moment().diff(entityValues["DfXY7WHFzyc"], "years")} y
                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ border: 1, fontSize: 10, ml: 6, mr: 6, mt: 1, mb: 1 }}>
            <Table
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "40%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {DEPARTMENT} :&nbsp;&nbsp;
                        {obj["Hospital department"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {SAMPLE_TYPE} :&nbsp;&nbsp;
                        {obj["Sample type"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%", textAlign: "right" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        AMR ID :&nbsp;&nbsp;
                        {obj["AMR ID"]}
                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ width: "40%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {LAB_ID} :&nbsp;&nbsp;
                        {obj["Lab ID"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {LOCATION} :&nbsp;&nbsp;
                        {obj["Patient Location"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "30%", textAlign: "right" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {SAMPLE_DATE}: :&nbsp;&nbsp;
                        {moment(obj["EventDate"]).format("DD/MM/yyyy")}
                      </Box>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ width: "40%" }}>
                    <Typography>
                      <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                        {PATHOGEN} :&nbsp;&nbsp;&nbsp;&nbsp;
                        {obj["Organism"]}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },
              }}
            >
              <TableBody>
                <Box
                  sx={{
                    border: 1,
                    fontSize: 10,
                    ml: 20,
                    mr: 20,
                    mt: 1,
                    mb: 1,
                    borderBottom: 0,
                    borderRight: 0,
                  }}
                >
                  {obj.dataValue.map((de, index) => (
                    <TableRow>
                      <TableCell
                        className={classes.tableRightBorder + " " + "antibio"}
                        style={{
                          width: "10%",
                          borderBottom: "1px solid black",
                        }}
                      >
                        <Typography>
                          <Box className="boxClass" sx={{ fontSize: 10, m: 1 }}>
                            {index + 1}
                          </Box>
                        </Typography>
                      </TableCell>

                      <TableCell
                        className={classes.tableRightBorder + " " + "antibio"}
                        style={{
                          width: "60%",
                          textAlign: "center",
                          borderBottom: "1px solid black",
                        }}
                      >
                        <Typography>
                          <Box className="boxClass" sx={{ fontSize: 10, m: 1 }}>
                            {de.formName}
                          </Box>
                        </Typography>
                      </TableCell>
                      <TableCell
                        className="antibio"
                        style={{ borderBottom: "1px solid black" }}
                      >
                        <Typography>
                          <Box
                            className="boxClass"
                            sx={{ fontSize: 10, m: 1 }}
                          ></Box>
                        </Typography>
                      </TableCell>

                      <TableCell
                        className={classes.tableRightBorder + " " + "antibio"}
                        style={{
                          width: "60%",
                          textAlign: "left",
                          borderBottom: "1px solid black",
                        }}
                      >
                        <Typography>
                          <Box className="boxClass" sx={{ fontSize: 10, m: 1 }}>
                            {de.value}
                          </Box>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </Box>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
