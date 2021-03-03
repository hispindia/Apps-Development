import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {Table,TableCell,TableBody,TableRow,TableContainer,Paper,TableHead,Checkbox,Snackbar} from "@material-ui/core";
import { ApiService } from "../services/apiService";
import MuiAlert from "@material-ui/lab/Alert";
import Pagination from '@material-ui/lab/Pagination';
import {setAssignOU, changePage} from '../redux/action/event'
function Alert(props) {return <MuiAlert elevation={6} variant="filled" {...props} />;}
const Tables = () => {
  const [open, setOpen] = useState(false);
  const [openN, setOpenN] = useState(false);
  const dispatch = useDispatch();
  const datasets = useSelector((state) => state.data.dataSets);
  const OrgUnitList = useSelector((state) => state.data.ouList);
  const assignedOU = useSelector((state) => state.data.assignedOU);
  const isFirstRender = useSelector((state) => state.data.isFirstRender)
  const pageCount=Math.trunc(OrgUnitList.length/6)+1;
  var OUList = []
  const onChecked = (e, i, j) => {
    if (e.target.checked == true) {
      let ds = datasets.find((ds, dj) => dj == j);
      let ou = OrgUnitList.find((ou, OUi) => OUi == i);
      let obj = {additions: [{ id: ou.id }],deletions: [{}]};
      ApiService.postOUAssginedDS(obj, ds.id).then((res) => {});
      ApiService.getOUAssginedDS().then(res =>{dispatch(setAssignOU(res.dataSets))})
      setOpen(true);
    } else {
      let ds = datasets.find((ds, dj) => dj == j);
      let ou = OrgUnitList.find((ou, OUi) => OUi == i);
      let obj = {additions: [{}], deletions: [{ id: ou.id }] };
      ApiService.postOUAssginedDS(obj, ds.id).then((res) => {});
      ApiService.getOUAssginedDS().then(res =>{dispatch(setAssignOU(res.dataSets))})
      setOpenN(true);
    }
  };
  const handleClose =()=>{setOpen(false);}
  const handleClosed =()=>{setOpenN(false);}
  if (datasets == undefined) return null;
  if (OrgUnitList == null || assignedOU == null) return null;
  OrgUnitList.forEach((ou) => {
    for (let ds of assignedOU) {
      for (let ele of ds.organisationUnits) {if (ele.id == ou.id) { ds[ou.id+"-Checked"] = true;}}
    }
assignedOU.forEach((ele) => {ou["ds"] = ele.organisationUnits.filter((orgUnit) => ou.id == orgUnit.id).map((ou) => ({ ...ou, checkedStatus: true }));});});
 if(isFirstRender) OUList= OrgUnitList.filter((ou,i)=> {if(i<6) return ou})
 else OUList = OrgUnitList
  const handleChangePage = (event, value)=>{
    let ouArr= OrgUnitList.filter((ou,i)=> {if(i<value*6) return ou})
     dispatch(changePage(ouArr))
  }
  return (
    <TableContainer component={Paper} elevation={12}>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">Organisation Unit Assigned Success !</Alert>
      </Snackbar>
      <Snackbar open={openN} autoHideDuration={1000} onClosed={handleClose}>
        <Alert onClose={handleClosed} severity="success">Organisation Unit Unassigned Success !</Alert>
      </Snackbar>
      <Table aria-label="simple table" id="tRow">
        <TableHead style={{background:"#3f51b5",}}>
          <TableRow >
            <TableCell><span style={{color: "white"}}>SN</span></TableCell>
            <TableCell><span style={{color:"white"}}>Data Sets/Org Unit</span></TableCell>
            {datasets.map((dataSet) =>(<TableCell key={dataSet.id}><span style={{color:"white"}}>{dataSet.displayName}</span></TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {OUList.map((ou, i) => (
            <TableRow key={ou.id}>
              <TableCell>{++i}</TableCell>
              <TableCell>{ou.name}</TableCell>
              {assignedOU.map((ds, j) =>(<TableCell key={ds.id}><Checkbox color="primary" onChange={(e) => onChecked(e, i - 1, j)} checked={ds[ou.id+"-Checked"]} /></TableCell>))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{float:"right", padding:"5px"}}>
        <Pagination count={pageCount} color="primary" onChange={handleChangePage} />
      </div>
    </TableContainer>
  );
};

export default Tables;
