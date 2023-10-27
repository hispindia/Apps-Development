import { get } from '@hisp-amr/api'
import axios from 'axios'
export const getTEIAll = async orgUnit => {
    var teiRows = []
    var tracklist = []
    var SampleList = [];
    var url = ""
    var SampleDict = {};
    var result = []
    var todayDate = new Date();
    var tempYear = new Date(new Date().setDate(new Date().getDate() - 60)).getFullYear();
    var tempMonth = new Date(new Date().setDate(new Date().getDate() - 60)).getMonth();
    var tempDate = new Date(new Date().setDate(new Date().getDate() - 60)).getDate();
    var mm = tempMonth + 1;
    if( mm < 9){
        mm = "0"+mm;
    }
    var isoDateFormat = tempYear + "-" + mm + "-" + tempDate;
    var twoMonthBeforeDate = new Date(new Date().setDate(new Date().getDate() - 60));
    //api/trackedEntityInstances.json?ouMode=DESCENDANTS&ou=ANGhR1pa8I5&paging=false&lastUpdatedStartDate=2022-07-13&&lastUpdatedEndDate=2022-09-13
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=2021-01-01&skipPaging=true"
    let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&order=lastUpdated:desc&skipPaging=true"
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&skipPaging=true"
    let api3 = '../../../api/29/sqlViews/gxov92xU7S7/data.json&paging=false' // Local Db
    let api4 = '../../../api/sqlViews/WKhh3qxwcPW/data.json?paging=false' // Baseline DB
    let apiForProgram = '../../../api/organisationUnits/'+orgUnit+'.json?fields=id,name,programs[id,name]&paging=false' // loading program for the ou
    const requestOne = axios.get(api1);
    const requestThree = axios.get(api4);
    
   return axios
  .all([requestOne, requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
      const responseThree = responses[1];
        if (responseOne.data.trackedEntityInstances) {
         if (responseThree.data.listGrid.rows) {
           responseThree.data.listGrid.rows.forEach(events => {
            var dataElement = {};
            var orgunits = events[0]
               var trackerid = events[1]
               var labSampleID = ""
               var tempEventDate = "";
               var sampleValue = "";
               var locationValue = "";
            if (!SampleDict.hasOwnProperty(trackerid)) {

                if (!events[5]) {
                    tempEventDate = "No data to show";
                }
                else {
                    tempEventDate = events[5];
                }
                //var eventDataValuesOutputArray = JSON.parse(events[3].value);
                var eventDataValuesOutputArray = JSON.parse(events[3]);
                for (const [key, value] of Object.entries(eventDataValuesOutputArray)) {
                    if (!dataElement.hasOwnProperty(key)) {
                        dataElement[key] = [value.value,value.created];
                    }
                }
                if (dataElement["mp5MeJ2dFQz"]) {
                    sampleValue = dataElement["mp5MeJ2dFQz"][0];
                    //eventdate = dataElement["mp5MeJ2dFQz"][1]
                }
                else {
                    sampleValue = "No data to show";
                }
                if (dataElement["GpAu5HjWAEz"]) {
                    labSampleID = dataElement["GpAu5HjWAEz"][0];
                }
                if (dataElement["B7XuDaXPv10"]) {
                    locationValue = dataElement["B7XuDaXPv10"][0];
                }

                    SampleDict[trackerid] = [orgunits, tempEventDate, sampleValue, labSampleID, locationValue]
                }
            });
        }
            responseOne.data.trackedEntityInstances.forEach((teis) => {
            const trackedEntityInstance = teis.trackedEntityInstance;
            const orgUnit = teis.orgUnit;

            if( SampleDict[ trackedEntityInstance ] && SampleDict[ trackedEntityInstance ].length ){

                let index = teiRows.length;
                teiRows[index] = ['', '', '', '', '', '','','','','','']
                teis.attributes.forEach(tei => {
                    if (tei.attribute === 'nFrlz82c6jS')
                        teiRows[index]['0'] = tei.value; //CR Number
                    if (tei.attribute === 'D6QGzhnkKOW')
                        teiRows[index]['1'] = tei.value; //Name
                    if (tei.attribute === 'DfXY7WHFzyc')
                        teiRows[index]['3'] = tei.value; //Age
                    if (tei.attribute === 'VXRRpqAdrdK')
                        teiRows[index]['4'] = tei.value; //Sex
                    if (tei.attribute === 'ZgUp0jFVxdY')
                        teiRows[index]['5'] = tei.value; //Address

                    teiRows[index]['6'] = orgUnit;
                    teiRows[index]['7'] = trackedEntityInstance;

                    if ((trackedEntityInstance in SampleDict)) {
                        //teiRows[index]['8'] = SampleDict[trackedEntityInstance][1].split("T")[0]
                        teiRows[index]['8'] = SampleDict[trackedEntityInstance][1];
                        teiRows[index]['9'] = SampleDict[trackedEntityInstance][2];
                        teiRows[index]['10'] = SampleDict[trackedEntityInstance][3];
                        teiRows[index]['2'] = SampleDict[trackedEntityInstance][4]; // for location/Ward
                    }
                })

            }

        })
      }
        //return teiRows.reverse();
        return teiRows.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b[8]) - new Date(a[8]);
        });
    })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });

  
}
export const getPendingSampleResult = async orgUnit => {
    var teiRows = []
    var tracklist = []
    var SampleList = [];
    var url = ""
    var SampleDict = {};
    var result = []
    var todayDate = new Date();
    var tempYear = new Date(new Date().setDate(new Date().getDate() - 60)).getFullYear();
    var tempMonth = new Date(new Date().setDate(new Date().getDate() - 60)).getMonth();
    var tempDate = new Date(new Date().setDate(new Date().getDate() - 60)).getDate();
    var mm = tempMonth + 1;
    if( mm < 9){
        mm = "0"+mm;
    }
    var isoDateFormat = tempYear + "-" + mm + "-" + tempDate;
    var twoMonthBeforeDate = new Date(new Date().setDate(new Date().getDate() - 60));
   let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&order=lastUpdated:desc&skipPaging=true"
   
    let api3 = '../../../api/29/sqlViews/gxov92xU7S7/data.json&paging=false' // Local Db
    let api4 = '../../../api/sqlViews/tmsk1VhkVEI/data.json?paging=false' // Baseline DB
    let apiForProgram = '../../../api/organisationUnits/'+orgUnit+'.json?fields=id,name,programs[id,name]&paging=false' // loading program for the ou
    const requestOne = axios.get(api1);
    const requestThree = axios.get(api4);
    
   return axios
  .all([requestOne, requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
      const responseThree = responses[1];
        if (responseOne.data.trackedEntityInstances) {
         if (responseThree.data.listGrid.rows) {
           responseThree.data.listGrid.rows.forEach(events => {
            var dataElement = {};
            var orgunits = events[0]
               var trackerid = events[1]
               var labSampleID = ""
               var tempEventDate = "";
               var sampleValue = "";
               var locationValue = "";
            if (!SampleDict.hasOwnProperty(trackerid)) {

                if (!events[5]) {
                    tempEventDate = "No data to show";
                }
                else {
                    tempEventDate = events[5];
                }
                //var eventDataValuesOutputArray = JSON.parse(events[3].value);
                var eventDataValuesOutputArray = JSON.parse(events[3]);
                for (const [key, value] of Object.entries(eventDataValuesOutputArray)) {
                    if (!dataElement.hasOwnProperty(key)) {
                        dataElement[key] = [value.value,value.created];
                    }
                }
                if (dataElement["mp5MeJ2dFQz"]) {
                    sampleValue = dataElement["mp5MeJ2dFQz"][0];
                    //eventdate = dataElement["mp5MeJ2dFQz"][1]
                }
                else {
                    sampleValue = "No data to show";
                }
                if (dataElement["GpAu5HjWAEz"]) {
                    labSampleID = dataElement["GpAu5HjWAEz"][0];
                }
                if (dataElement["B7XuDaXPv10"]) {
                    locationValue = dataElement["B7XuDaXPv10"][0];
                }

                    SampleDict[trackerid] = [orgunits, tempEventDate, sampleValue, labSampleID, locationValue]
                }
            });
        }
            responseOne.data.trackedEntityInstances.forEach((teis) => {
            const trackedEntityInstance = teis.trackedEntityInstance;
            const orgUnit = teis.orgUnit;

            if( SampleDict[ trackedEntityInstance ] && SampleDict[ trackedEntityInstance ].length ){

                let index = teiRows.length;
                teiRows[index] = ['', '', '', '', '', '','','','','','']
                teis.attributes.forEach(tei => {
                    if (tei.attribute === 'nFrlz82c6jS')
                        teiRows[index]['0'] = tei.value; //CR Number
                    if (tei.attribute === 'D6QGzhnkKOW')
                        teiRows[index]['1'] = tei.value; //Name
                    if (tei.attribute === 'DfXY7WHFzyc')
                        teiRows[index]['3'] = tei.value; //Age
                    if (tei.attribute === 'VXRRpqAdrdK')
                        teiRows[index]['4'] = tei.value; //Sex
                    if (tei.attribute === 'ZgUp0jFVxdY')
                        teiRows[index]['5'] = tei.value; //Address

                    teiRows[index]['6'] = orgUnit;
                    teiRows[index]['7'] = trackedEntityInstance;

                    if ((trackedEntityInstance in SampleDict)) {
                        //teiRows[index]['8'] = SampleDict[trackedEntityInstance][1].split("T")[0]
                        teiRows[index]['8'] = SampleDict[trackedEntityInstance][1];
                        teiRows[index]['9'] = SampleDict[trackedEntityInstance][2];
                        teiRows[index]['10'] = SampleDict[trackedEntityInstance][3];
                        teiRows[index]['2'] = SampleDict[trackedEntityInstance][4]; // for location/Ward
                    }
                })

            }

        })
      }
        //return teiRows.reverse();
        return teiRows.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b[8]) - new Date(a[8]);
        });
    })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });

  
}
export const getSterileTEI = async orgUnit => {
    var teiRows = []
    var tracklist = []
    var SampleList = [];
    var url = ""
    var SampleDict = {};
    var result = []
    var todayDate = new Date();
    var tempYear = new Date(new Date().setDate(new Date().getDate() - 60)).getFullYear();
    var tempMonth = new Date(new Date().setDate(new Date().getDate() - 60)).getMonth();
    var tempDate = new Date(new Date().setDate(new Date().getDate() - 60)).getDate();
    var mm = tempMonth + 1;
    if( mm < 9){
        mm = "0"+mm;
    }
    var isoDateFormat = tempYear + "-" + mm + "-" + tempDate;
    var twoMonthBeforeDate = new Date(new Date().setDate(new Date().getDate() - 60));
    //api/trackedEntityInstances.json?ouMode=DESCENDANTS&ou=ANGhR1pa8I5&paging=false&lastUpdatedStartDate=2022-07-13&&lastUpdatedEndDate=2022-09-13
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=2021-01-01&skipPaging=true"
    let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&order=lastUpdated:desc&skipPaging=true"
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&skipPaging=true"
    let api3 = '../../../api/29/sqlViews/gxov92xU7S7/data.json&paging=false' // Local Db
    let api4 = '../../../api/sqlViews/yURdPSBAKpn/data.json?paging=false' // Baseline DB
    let apiForProgram = '../../../api/organisationUnits/'+orgUnit+'.json?fields=id,name,programs[id,name]&paging=false' // loading program for the ou
    const requestOne = axios.get(api1);
    const requestThree = axios.get(api4);
    
   return axios
  .all([requestOne, requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
      const responseThree = responses[1];
        if (responseOne.data.trackedEntityInstances) {
         if (responseThree.data.listGrid.rows) {
           responseThree.data.listGrid.rows.forEach(events => {
            var dataElement = {};
            var orgunits = events[0]
               var trackerid = events[1]
               var labSampleID = ""
               var tempEventDate = "";
               var sampleValue = "";
               var locationValue = "";
            if (!SampleDict.hasOwnProperty(trackerid)) {

                if (!events[5]) {
                    tempEventDate = "No data to show";
                }
                else {
                    tempEventDate = events[5];
                }
                //var eventDataValuesOutputArray = JSON.parse(events[3].value);
                var eventDataValuesOutputArray = JSON.parse(events[3]);
                for (const [key, value] of Object.entries(eventDataValuesOutputArray)) {
                    if (!dataElement.hasOwnProperty(key)) {
                        dataElement[key] = [value.value,value.created];
                    }
                }
                if (dataElement["mp5MeJ2dFQz"]) {
                    sampleValue = dataElement["mp5MeJ2dFQz"][0];
                    //eventdate = dataElement["mp5MeJ2dFQz"][1]
                }
                else {
                    sampleValue = "No data to show";
                }
                if (dataElement["GpAu5HjWAEz"]) {
                    labSampleID = dataElement["GpAu5HjWAEz"][0];
                }
                if (dataElement["B7XuDaXPv10"]) {
                    locationValue = dataElement["B7XuDaXPv10"][0];
                }

                    SampleDict[trackerid] = [orgunits, tempEventDate, sampleValue, labSampleID, locationValue]
                }
            });
        }
            responseOne.data.trackedEntityInstances.forEach((teis) => {
            const trackedEntityInstance = teis.trackedEntityInstance;
            const orgUnit = teis.orgUnit;

            if( SampleDict[ trackedEntityInstance ] && SampleDict[ trackedEntityInstance ].length ){

                let index = teiRows.length;
                teiRows[index] = ['', '', '', '', '', '','','','','','']
                teis.attributes.forEach(tei => {
                    if (tei.attribute === 'nFrlz82c6jS')
                        teiRows[index]['0'] = tei.value; //CR Number
                    if (tei.attribute === 'D6QGzhnkKOW')
                        teiRows[index]['1'] = tei.value; //Name
                    if (tei.attribute === 'DfXY7WHFzyc')
                        teiRows[index]['3'] = tei.value; //Age
                    if (tei.attribute === 'VXRRpqAdrdK')
                        teiRows[index]['4'] = tei.value; //Sex
                    if (tei.attribute === 'ZgUp0jFVxdY')
                        teiRows[index]['5'] = tei.value; //Address

                    teiRows[index]['6'] = orgUnit;
                    teiRows[index]['7'] = trackedEntityInstance;

                    if ((trackedEntityInstance in SampleDict)) {
                        //teiRows[index]['8'] = SampleDict[trackedEntityInstance][1].split("T")[0]
                        teiRows[index]['8'] = SampleDict[trackedEntityInstance][1];
                        teiRows[index]['9'] = SampleDict[trackedEntityInstance][2];
                        teiRows[index]['10'] = SampleDict[trackedEntityInstance][3];
                        teiRows[index]['2'] = SampleDict[trackedEntityInstance][4]; // for location/Ward
                    }
                })

            }

        })
      }
        //return teiRows.reverse();
        return teiRows.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b[8]) - new Date(a[8]);
        });
    })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });

  
}
export const getPendingAntiResult = async orgUnit => {
    var teiRows = []
    var tracklist = []
    var SampleList = [];
    var url = ""
    var SampleDict = {};
    var result = []
    var todayDate = new Date();
    var tempYear = new Date(new Date().setDate(new Date().getDate() - 60)).getFullYear();
    var tempMonth = new Date(new Date().setDate(new Date().getDate() - 60)).getMonth();
    var tempDate = new Date(new Date().setDate(new Date().getDate() - 60)).getDate();
    var mm = tempMonth + 1;
    if( mm < 9){
        mm = "0"+mm;
    }
    var isoDateFormat = tempYear + "-" + mm + "-" + tempDate;
    var twoMonthBeforeDate = new Date(new Date().setDate(new Date().getDate() - 60));
    //api/trackedEntityInstances.json?ouMode=DESCENDANTS&ou=ANGhR1pa8I5&paging=false&lastUpdatedStartDate=2022-07-13&&lastUpdatedEndDate=2022-09-13
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=2021-01-01&skipPaging=true"
    let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&order=lastUpdated:desc&skipPaging=true"
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&skipPaging=true"
    let api3 = '../../../api/29/sqlViews/gxov92xU7S7/data.json&paging=false' // Local Db
    let api4 = '../../../api/sqlViews/vhnfcA59Pl4/data.json?paging=false' // Baseline DB
    let apiForProgram = '../../../api/organisationUnits/'+orgUnit+'.json?fields=id,name,programs[id,name]&paging=false' // loading program for the ou
    const requestOne = axios.get(api1);
    const requestThree = axios.get(api4);
    
   return axios
  .all([requestOne, requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
      const responseThree = responses[1];
        if (responseOne.data.trackedEntityInstances) {
         if (responseThree.data.listGrid.rows) {
           responseThree.data.listGrid.rows.forEach(events => {
            var dataElement = {};
            var orgunits = events[0]
               var trackerid = events[1]
               var labSampleID = ""
               var tempEventDate = "";
               var sampleValue = "";
               var locationValue = "";
            if (!SampleDict.hasOwnProperty(trackerid)) {

                if (!events[5]) {
                    tempEventDate = "No data to show";
                }
                else {
                    tempEventDate = events[5];
                }
                //var eventDataValuesOutputArray = JSON.parse(events[3].value);
                var eventDataValuesOutputArray = JSON.parse(events[3]);
                for (const [key, value] of Object.entries(eventDataValuesOutputArray)) {
                    if (!dataElement.hasOwnProperty(key)) {
                        dataElement[key] = [value.value,value.created];
                    }
                }
                if (dataElement["mp5MeJ2dFQz"]) {
                    sampleValue = dataElement["mp5MeJ2dFQz"][0];
                    //eventdate = dataElement["mp5MeJ2dFQz"][1]
                }
                else {
                    sampleValue = "No data to show";
                }
                if (dataElement["GpAu5HjWAEz"]) {
                    labSampleID = dataElement["GpAu5HjWAEz"][0];
                }
                if (dataElement["B7XuDaXPv10"]) {
                    locationValue = dataElement["B7XuDaXPv10"][0];
                }

                    SampleDict[trackerid] = [orgunits, tempEventDate, sampleValue, labSampleID, locationValue]
                }
            });
        }
            responseOne.data.trackedEntityInstances.forEach((teis) => {
            const trackedEntityInstance = teis.trackedEntityInstance;
            const orgUnit = teis.orgUnit;

            if( SampleDict[ trackedEntityInstance ] && SampleDict[ trackedEntityInstance ].length ){

                let index = teiRows.length;
                teiRows[index] = ['', '', '', '', '', '','','','','','']
                teis.attributes.forEach(tei => {
                    if (tei.attribute === 'nFrlz82c6jS')
                        teiRows[index]['0'] = tei.value; //CR Number
                    if (tei.attribute === 'D6QGzhnkKOW')
                        teiRows[index]['1'] = tei.value; //Name
                    if (tei.attribute === 'DfXY7WHFzyc')
                        teiRows[index]['3'] = tei.value; //Age
                    if (tei.attribute === 'VXRRpqAdrdK')
                        teiRows[index]['4'] = tei.value; //Sex
                    if (tei.attribute === 'ZgUp0jFVxdY')
                        teiRows[index]['5'] = tei.value; //Address

                    teiRows[index]['6'] = orgUnit;
                    teiRows[index]['7'] = trackedEntityInstance;

                    if ((trackedEntityInstance in SampleDict)) {
                        //teiRows[index]['8'] = SampleDict[trackedEntityInstance][1].split("T")[0]
                        teiRows[index]['8'] = SampleDict[trackedEntityInstance][1];
                        teiRows[index]['9'] = SampleDict[trackedEntityInstance][2];
                        teiRows[index]['10'] = SampleDict[trackedEntityInstance][3];
                        teiRows[index]['2'] = SampleDict[trackedEntityInstance][4]; // for location/Ward
                    }
                })

            }

        })
      }
        //return teiRows.reverse();
        return teiRows.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b[8]) - new Date(a[8]);
        });
    })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });

  
}
export const getAntibioticFollowTEI = async orgUnit => {
    var teiRows = []
    var tracklist = []
    var SampleList = [];
    var url = ""
    var SampleDict = {};
    var result = []
    var todayDate = new Date();
    var tempYear = new Date(new Date().setDate(new Date().getDate() - 60)).getFullYear();
    var tempMonth = new Date(new Date().setDate(new Date().getDate() - 60)).getMonth();
    var tempDate = new Date(new Date().setDate(new Date().getDate() - 60)).getDate();
    var mm = tempMonth + 1;
    if( mm < 9){
        mm = "0"+mm;
    }
    var isoDateFormat = tempYear + "-" + mm + "-" + tempDate;
    var twoMonthBeforeDate = new Date(new Date().setDate(new Date().getDate() - 60));
    //api/trackedEntityInstances.json?ouMode=DESCENDANTS&ou=ANGhR1pa8I5&paging=false&lastUpdatedStartDate=2022-07-13&&lastUpdatedEndDate=2022-09-13
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=2021-01-01&skipPaging=true"
    let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&order=lastUpdated:desc&skipPaging=true"
    //let api1 = "../../../api/trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou="+orgUnit+"&lastUpdatedStartDate=" + isoDateFormat +"&skipPaging=true"
    let api3 = '../../../api/29/sqlViews/gxov92xU7S7/data.json&paging=false' // Local Db
    let api4 = '../../../api/sqlViews/dFkTykXa7Sx/data.json?paging=false' // Baseline DB
    let apiForProgram = '../../../api/organisationUnits/'+orgUnit+'.json?fields=id,name,programs[id,name]&paging=false' // loading program for the ou
    const requestOne = axios.get(api1);
    const requestThree = axios.get(api4);
    
   return axios
  .all([requestOne, requestThree])
  .then(
    axios.spread((...responses) => {
      const responseOne = responses[0];
      const responseThree = responses[1];
        if (responseOne.data.trackedEntityInstances) {
         if (responseThree.data.listGrid.rows) {
           responseThree.data.listGrid.rows.forEach(events => {
            var dataElement = {};
            var orgunits = events[0]
               var trackerid = events[1]
               var labSampleID = ""
               var tempEventDate = "";
               var sampleValue = "";
               var locationValue = "";
            if (!SampleDict.hasOwnProperty(trackerid)) {

                if (!events[5]) {
                    tempEventDate = "No data to show";
                }
                else {
                    tempEventDate = events[5];
                }
                //var eventDataValuesOutputArray = JSON.parse(events[3].value);
                var eventDataValuesOutputArray = JSON.parse(events[3]);
                for (const [key, value] of Object.entries(eventDataValuesOutputArray)) {
                    if (!dataElement.hasOwnProperty(key)) {
                        dataElement[key] = [value.value,value.created];
                    }
                }
                if (dataElement["mp5MeJ2dFQz"]) {
                    sampleValue = dataElement["mp5MeJ2dFQz"][0];
                    //eventdate = dataElement["mp5MeJ2dFQz"][1]
                }
                else {
                    sampleValue = "No data to show";
                }
                if (dataElement["GpAu5HjWAEz"]) {
                    labSampleID = dataElement["GpAu5HjWAEz"][0];
                }
                if (dataElement["B7XuDaXPv10"]) {
                    locationValue = dataElement["B7XuDaXPv10"][0];
                }

                    SampleDict[trackerid] = [orgunits, tempEventDate, sampleValue, labSampleID, locationValue]
                }
            });
        }
            responseOne.data.trackedEntityInstances.forEach((teis) => {
            const trackedEntityInstance = teis.trackedEntityInstance;
            const orgUnit = teis.orgUnit;

            if( SampleDict[ trackedEntityInstance ] && SampleDict[ trackedEntityInstance ].length ){

                let index = teiRows.length;
                teiRows[index] = ['', '', '', '', '', '','','','','','']
                teis.attributes.forEach(tei => {
                    if (tei.attribute === 'nFrlz82c6jS')
                        teiRows[index]['0'] = tei.value; //CR Number
                    if (tei.attribute === 'D6QGzhnkKOW')
                        teiRows[index]['1'] = tei.value; //Name
                    if (tei.attribute === 'DfXY7WHFzyc')
                        teiRows[index]['3'] = tei.value; //Age
                    if (tei.attribute === 'VXRRpqAdrdK')
                        teiRows[index]['4'] = tei.value; //Sex
                    if (tei.attribute === 'ZgUp0jFVxdY')
                        teiRows[index]['5'] = tei.value; //Address

                    teiRows[index]['6'] = orgUnit;
                    teiRows[index]['7'] = trackedEntityInstance;

                    if ((trackedEntityInstance in SampleDict)) {
                        //teiRows[index]['8'] = SampleDict[trackedEntityInstance][1].split("T")[0]
                        teiRows[index]['8'] = SampleDict[trackedEntityInstance][1];
                        teiRows[index]['9'] = SampleDict[trackedEntityInstance][2];
                        teiRows[index]['10'] = SampleDict[trackedEntityInstance][3];
                        teiRows[index]['2'] = SampleDict[trackedEntityInstance][4]; // for location/Ward
                    }
                })

            }

        })
      }
        //return teiRows.reverse();
        return teiRows.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b[8]) - new Date(a[8]);
        });
    })
    ).then((teiRows) => { return teiRows })
  .catch(errors => {
    console.error(errors);
  });

  
}