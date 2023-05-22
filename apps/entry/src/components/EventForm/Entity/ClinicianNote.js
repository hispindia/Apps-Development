import React, { useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import "./print.css";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {DataElements} from '../../../api/dataElements'
export default function ClinicianNote(props) {
  const [open, setOpen] = useState(false);
  const entity = useSelector((state) => state.data.entity);
  const panel = useSelector((state) => state.data.panel);
  const event = useSelector((state) => state.data.event);
  const [dateValue, setDateValue] = useState(event.values.tCLjgLjshns);
  const [yesNoValue, setYesNoValue] = useState(event.values.ZoaXelmyI3P);
  const orgUnit = useSelector((state) => state.data.orgUnit);
  const mappedProgramAndProgramStage = [
    {program:"dzizG8i1cmP",stage:"imi75Ndzv45"},
    {program:"rMiBliR4FGr",stage:"imi75Ndzv45"},
    {program:"STe7Xraobt2",stage:"RfR453XFEva"},	
    {program:"gPO5iFsfu3S",stage:"v7ULjKAh14a"},
    {program:"h6EWlNCpHTz",stage:"pgCOepnav1t"},	
    {program:"Bj4ZJzd9Uz9",stage:"TGjDE8vuPwA"},	
    {program:"BUfpwe2iUQb",stage:"TGjDE8vuPwA"},
    {program:"zNCtvgxrWxO",stage:"gdY15tam89q"},	
    ]
  const setDate = (e) => {
        setDateValue(e.target.value)
        let ps = mappedProgramAndProgramStage.find(element => element.program ==panel.program )
        let obj ={
        "dataValues":[{"dataElement": "tCLjgLjshns", value: e.target.value}],
        "event":event.id,
        "orgUnit":orgUnit.id,
        "program":panel.program,
        "programStage":ps['stage'],
        "status":"ACTIVE",
        "trackedEntityInstance": entity.id    
    }
    DataElements.pushEvent(obj, event.id,"tCLjgLjshns").then(res =>{
        console.log('sucess')
    })
}
const handleChange =(evt)=>{
    setYesNoValue(evt.target.value)
    if(evt.target.value == "true"){
        setOpen(true)
    }else{
        setOpen(false)  
    }
    let ps = mappedProgramAndProgramStage.find(element => element.program ==panel.program )
    let obj ={
        "dataValues":[ {"dataElement": "ZoaXelmyI3P", value: evt.target.value }],
        "event":event.id,
        "orgUnit":orgUnit.id,
        "program":panel.program,
        "programStage":ps['stage'],
        "status":"ACTIVE",
        "trackedEntityInstance": entity.id  
    }
    DataElements.pushEvent(obj, event.id,"ZoaXelmyI3P").then(res =>{
        console.log("success")
    })
}
  return (
    <>
    <Grid container>
          <Grid>
            <span
              style={{
                marginRight: "150px",
                fontWeight: "bold",
              }}
            >
              Report collection
            </span>
          </Grid>
        </Grid>
     <Grid container spacing={2}>
            <Grid  xs={6}  style={{ textAlign: "left", marginTop: "15px" }}>
                <span>Have the reports been collected?</span>
            </Grid>
        <Grid  xs={6} style={{ textAlign: "left",}}> 
            <span><RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue=""
                name="Have the reports been collected?"
                value={yesNoValue}
                onChange={e=>handleChange(e)}
            > 
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup></span>
        </Grid>
    </Grid>
    {open || yesNoValue=="true" ? 
    <Grid container spacing={2}>
        <Grid  xs={6} style={{ textAlign: "left" }}> 
            <span>Report collection date</span>
        </Grid>
        <Grid  xs={6} style={{ textAlign: "left" }}>
         <input type="date" id="date" value={dateValue} onChange={e=>setDate(e)} name="Date" />
        </Grid>
    </Grid>
  :""}
    </>
   );
}
