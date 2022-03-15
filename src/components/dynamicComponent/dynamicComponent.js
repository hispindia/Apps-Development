import React, { Component } from 'react';
import { ApiService } from "./service";
import $ from 'jquery';
class DynamicComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            jsonData: null,
            isVisibleDJB: false,
            loading: false,
            ouId:null, 
            indicatorGroups: null
        }
    }
    componentDidMount(){
        let cbdOrgUnitGrp =  'GhuHmwRnPBs';
        ApiService.getOrgUnits( cbdOrgUnitGrp ).then(res =>{
        ApiService.getIndicatorGroups().then(data =>{
          this.setState({ouId :res.organisationUnits.map(ele =>ele.id).join(";"),indicatorGroups:data.indicatorGroups})
        })
      })
    }
    generateJson(){
        let date =  $("#date").val()
        let obj = {dataValues: []}
        this.state.indicatorGroups.forEach((element,i) => {
          ApiService.getJsonData(element.name.split("(")[1].split(")")[0],this.state.ouId, date.replace(/-/g, "")).then(data =>{
                data.dataValues.forEach(ele =>{
                    obj['dataValues'].push(ele)
                  })
                   if(i === (this.state.indicatorGroups.length-1)){
                    this.setState({isVisibleDJB: true})
                }
           })
          
        });   
        this.setState({jsonData: obj, loading: true}) 
    }
    downloadToJson(){
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(this.state.jsonData)
          )}`;
          const link = document.createElement("a");
          link.href = jsonString;
          link.download = "dataValueSet.json";
          link.click();
    }
    render() { 
        return ( 
            <div className='container'>
            <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-2 bg-white rounded cw"> 
                  <div className='row'>
                      <div className='col-4'>
                         Select Period: 
                      </div>
                      <div className='col-8'>
                       <input type="month" class="form-control" id="date" />
                      </div>
                  </div>
                  <div style={{textAlign: 'center', marginTop: '10'}}>
                     <button className='btn btn-success m-2 pt-2' onClick={e=>{this.generateJson(e)}} >Generate JSON</button>
                  </div>
                {this.state.isVisibleDJB ? <div style={{textAlign: 'center', marginTop: '10'}}> <button className='btn btn-success m-2 pt-2' onClick={e=>{this.downloadToJson(e)}} >Download as JSON</button></div> : this.state.loading ? <div id="loader" style={{display:"block"}}></div>: ""}
            </div>
         </div>
         );
    }
}
export default DynamicComponent;