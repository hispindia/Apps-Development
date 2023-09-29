import React, { useRef } from "react";
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
  CR_NUMBER,
  LAB_ID,
  LOCATION,
  DEPARTMENT,
  NAME,
  SAMPLE_DATE,
  REGISTRATION_DATE,
  SAMPLE_TYPE,
  GENDER,
  AGE,
  PATHOGEN_G,
  PATHOGEN,
  REASON_FOR_TESTING,
  PURPOSE_OF_SAMPLE,
  SYNDROME,
  ISOLATE,
} from "./constants";
import "./print.css";

const useStyles = makeStyles({
  root: {},
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
});

export default function EventListPrint(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const ref = useRef();
  var entityValues = useSelector((state) => state.data.entity.values);
  const dataElementObjects = useSelector(
    (state) => state.metadata.dataElementObjects
  );
  var eventsList = useSelector((state) => state.data.eventList);
  var tempDataElements = useSelector((state) => state.data.dataElements);
  let eventL = [];
  let metaDataDataElement = Object.values(dataElementObjects);
  let completeEvent = eventsList.filter((ev) => ev.program !== "L7bu48EI54J");
  let registrationDate = { "Reg Date": "" };
  completeEvent.forEach((event) => {
    if (event.status === "COMPLETED") {
      let obj = {
        "Hospital department": "",
        "Lab ID": "",
        Pathogen: "",
        "Patient Location": "",
        "Sample type": "",
        EventDate: "",
        "AMR ID": "",
        Organism: "",
        "Reason for Testing": "",
        "Purpose of sample": "",
        Syndrome: "",
        "Isolate / coloniser": "",
        dataValue: [],
      };
      let arr = [];
      // let program = programs.filter((p) => p.id == event.program);
      obj["EventDate"] = event.eventDate.split("T")[0];
      registrationDate["Reg Date"] = event.created.split("T")[0];
      // obj["program"] = program[0].name;
      event.dataValues.forEach((dv) => {
        let deObj = metaDataDataElement.filter((de) => {
          if (de.id === dv.dataElement) {
            de["value"] = dv.value;
            return de;
          }
        });
        if (
          deObj[0].id !== "B7XuDaXPv10" &&
          deObj[0].id !== "GpAu5HjWAEz" &&
          deObj[0].id !== "mp5MeJ2dFQz" &&
          deObj[0].id !== "dRKIjwIDab4" &&
          deObj[0].id !== "SaQe2REkGVw" &&
          deObj[0].id !== "dRKIjwIDab4" &&
          deObj[0].id !== "lIkk661BLpG" &&
          deObj[0].id !== "WxuMCW0sdbT" &&
          deObj[0].id !== "lJm7JZvPQxA" &&
          deObj[0].id !== "mOMWw59PvKU" &&
          deObj[0].id !== "MOsgkq0ptBm"
        ) {
          arr.push(deObj[0]);
        }
        if (dv.dataElement === "B7XuDaXPv10") {
          obj["Patient Location"] = dv.value;
        }
        if (dv.dataElement === "dRKIjwIDab4") {
          obj["Hospital department"] = dv.value;
        }
        if (dv.dataElement === "GpAu5HjWAEz") {
          obj["Lab ID"] = dv.value;
        }
        if (dv.dataElement === "mp5MeJ2dFQz") {
          obj["Sample type"] = dv.value;
        }
        if (dv.dataElement === "dRKIjwIDab4") {
          obj["Hospital department"] = dv.value;
        }
        if (dv.dataElement === "SaQe2REkGVw") {
          // let tempDeName= tempDataElements.filter(de=> de.code === dv.value)
          //   obj["Organism"] = tempDeName[0].name;
          obj["Organism"] = dv.value;
        }
        if (dv.dataElement === "lIkk661BLpG") {
          obj["AMR ID"] = dv.value;
        }
        if (dv.dataElement === "WxuMCW0sdbT") {
          obj["Reason for Testing"] = dv.value;
        }
        if (dv.dataElement === "lJm7JZvPQxA") {
          obj["Purpose of sample"] = dv.value;
        }
        if (dv.dataElement === "mOMWw59PvKU") {
          obj["Syndrome"] = dv.value;
        }
        if (dv.dataElement === "MOsgkq0ptBm") {
          obj["Isolate / coloniser"] = dv.value;
        }
      });
      let oarr = [];
      for (let ele of arr) {
        let val = parseInt(ele.value);
        let isNumber = Number.isInteger(val);
        if (!isNumber) {
          if (
            ele.id !== "DeFdBFxsFcj" &&
            ele.id !== "tQa6uU1t6s3" &&
            ele.id !== "YoCmEMUlZxb"
          ) {
            oarr.push(ele);
          }
        }
      }
      obj["dataValue"] = oarr;
      eventL.push(obj);
    }
  });
  const handlePrint = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => handleClose(),
  });
  const handleClose = () => {
    setOpen(false);
    props.onPrint(false);
  };
  const listItems = eventL.map((link) => (
    
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
            <TableCell style={{ width: "30%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {LOCATION} :&nbsp;&nbsp;{link["Patient Location"]}
                </Box>
              </Typography>
            </TableCell>
            <TableCell style={{ width: "40%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {DEPARTMENT} :&nbsp;&nbsp;
                  {link["Hospital department"]}
                </Box>
              </Typography>
            </TableCell>
            <TableCell style={{ width: "30%", textAlign: "right" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1,whiteSpace:'nowrap'  }} >
                  {SAMPLE_DATE} :&nbsp;&nbsp;
                  {moment(link["EventDate"]).format("DD/MM/yyyy")}
                </Box>
              </Typography>
            </TableCell>

            {/* <TableCell style={{ width: "30%", textAlign: "right" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  AMR ID :&nbsp;&nbsp;
                  {link["AMR ID"]}
                </Box>
              </Typography>
            </TableCell> */}
          </TableRow>
          <TableRow>
          <TableCell style={{ width: "30%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {ISOLATE} :&nbsp;&nbsp;&nbsp;&nbsp;
                  {/* {link["Isolate / coloniser"]} */}
                  {link["Isolate / coloniser"] === "P" ? "Pathogen" : "Coloniser"}
                </Box>
              </Typography>
            </TableCell>
            <TableCell style={{ width: "40%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1  }}>
                  {PATHOGEN} :&nbsp;&nbsp;&nbsp;&nbsp;
                  {link["Organism"]}
                </Box>
              </Typography>
            </TableCell>
            
            <TableCell style={{ width: "30%" ,textAlign: "right" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1,whiteSpace:'nowrap' }}>
                  {SYNDROME} :&nbsp;&nbsp;&nbsp;&nbsp;
                  {/* {link["Syndrome"]} */}
                  {link["Syndrome"] === "MEN" ? "Meningitis" : link["Syndrome"] === "GI" ? "GI infection" : link["Syndrome"]==" BSI"? "BSI" : link["Syndrome"]=="CLABSI" ? "CLABSI" :  link["Syndrome"]=="UTI" ? "UTI/SSI" : link["Syndrome"]=="VAP" ? "VAP" : "NA"}
                </Box>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ width: "30%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {LAB_ID} :&nbsp;&nbsp;{link["Lab ID"]}
                </Box>
              </Typography>
            </TableCell>
            <TableCell style={{ width: "40%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {SAMPLE_TYPE} :&nbsp;&nbsp;{link["Sample type"]}
                </Box>
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ width: "50%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {PURPOSE_OF_SAMPLE} :&nbsp;&nbsp;&nbsp;&nbsp;
                  {link["Purpose of sample"]}
                </Box>
              </Typography>
            </TableCell>
            <TableCell style={{ width: "50%" }}>
              <Typography>
                <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                  {REASON_FOR_TESTING} :&nbsp;&nbsp;
                  {link["Reason for Testing"]}
                </Box>
              </Typography>
            </TableCell>
          </TableRow>
       
        </TableBody>
      </Table>

      <Table>
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
            {console.log(link)}
            {link.dataValue.filter((de) => de.value !== "Positive" && de.value !=="Negative" && de.Metadata_type=="Antibiotic").map((de, index) => (
            
                <TableRow>
                <TableCell
                  className={classes.tableRightBorder + " " + "antibio"}
                  style={{ width: "10%", borderBottom: "1px solid black" }}
                >
                  <Typography>
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
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
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                      
                      {de?.formName?.replace("_Result","")}
                      {/* {de.code} */}
                      {/* {de.code? de.code : de.formName} */}
                    </Box>
                  </Typography>
                </TableCell>
                <TableCell
                  className="antibio"
                  style={{ borderBottom: "1px solid black" }}
                >
                  <Typography>
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}></Box>
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
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                      {de.value}
                    </Box>
                  </Typography>
                </TableCell>
              </TableRow>
              
             
              
            ))}
          </Box>
        </TableBody>
      </Table>
      <Table>
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
            {link.dataValue.filter((de) => de.value == "Positive" || de.value =="Negative").map((de, index) => (
            
                <TableRow>
                <TableCell
                  className={classes.tableRightBorder + " " + "antibio"}
                  style={{ width: "10%", borderBottom: "1px solid black" }}
                >
                  <Typography>
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
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
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
                      
                      {de?.formName?.replace("_Result","")}
                      {/* {de.code} */}
                      {/* {de.code? de.code : de.formName} */}
                    </Box>
                  </Typography>
                </TableCell>
                <TableCell
                  className="antibio"
                  style={{ borderBottom: "1px solid black" }}
                >
                  <Typography>
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}></Box>
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
                    <Box className="boxClass" sx={{ fontSize: 12, m: 1 }}>
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
  ));
  console.log("LIST IIIIIII", eventL);
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
                marginLeft: "10px",
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
                        {/* {moment(registrationDate["Reg Date"]).format(
                          "DD/MM/yyyy"
                        )} */}
                        {registrationDate["Reg Date"]
                          ? moment(registrationDate["Reg Date"]).format(
                              "DD/MM/yyyy"
                            )
                          : moment(eventsList[0].created).format("DD/MM/yyyy")}
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
          {listItems}
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
