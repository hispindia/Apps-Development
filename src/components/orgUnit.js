import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { OrgUnitTree } from "@hisp-amr/org-unit-tree";
import {Box, Grid, CircularProgress} from '@material-ui/core';
import Tables from './table'
import {getOrgUnitDetail,setDataSets, setOU, setAssignOU} from '../redux/action/event'
import { ApiService } from '../services/apiService'
const OrgUnit=()=> {
    const dispatch = useDispatch();
    const [Loader, setLoader] = useState(false);
    const onSelect = (data)=>{
        dispatch(getOrgUnitDetail(data))
        ApiService.getOU(data.id).then(res=>{
          let parent = {
            id: res.id,
            name:res.name
          }
          res.children.unshift(parent)
         dispatch(setOU(res.children))
        })
        ApiService.getOUAssginedDS().then(res =>{
        dispatch(setAssignOU(res.dataSets))
      })
     }
    const onError = (err)=>console.log(err)
    useEffect(()=>{
    ApiService.getDataSets().then(res =>{
        dispatch(setDataSets(res))
      })
      setLoader(true)
    })
    return (
      <>
    {Loader 
    ?       
    <Grid container>
    <div className="orgUnit" style={{marginRight: "20px", top: "15px", marginLeft:"15px", height:"600px", width:"200px", position: "sticky", overflow:"scroll"}} >
      <Box boxShadow={10}><OrgUnitTree onSelect={onSelect} onError={onError} /></Box>
    </div>
    <div style={{marginTop: "15px", width:"1100px"}} ><Tables /></div>
    </Grid>
    :
    <div style={{textAlign:'center', marginTop:"20%"}}>
      <CircularProgress color="primary" />
    </div>}
    </>
    )
}
export default OrgUnit