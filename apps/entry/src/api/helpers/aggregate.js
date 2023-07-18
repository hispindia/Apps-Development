import {
    get,
    request,
    post
} from '@hisp-amr/api'
import {
    Result
} from 'antd'

var CONSTANTS = {
    customAttributeMetadataTypeIdentifier: 'Metadata_type',
    locationCode: "Location",
    departmentCode: "Department",
    pathogenCode: "Organism",
    sampleTypeCode: "SampleType",
    sampleLocationDepartmentCC_Code: "sampleLocationDepartment",
    antibioticCC_Code: "antibiotic",
    defaultCC_code: "default",
    antibioticAttributeCode: 'Antibiotic',
    defaultDataSetCode: 'organismsIsolated',
    antibioticWiseDataSetCode: 'organismsIsolatedAntibioticWise',
    codesOfProgramsToAggregate: [] //TODO change this to a code

}

let getValue = async ({
    period,
    dataSet,
    de,
    orgUnit,
    cc,
    cp,
    co,
    operation
}) => {
    let a = await get(
        request(`dataValues.json`, {
            options: [`pe=${period}&ds=${dataSet}&de=${de}&ou=${orgUnit}&cc=${cc}&cp=${cp}&co=${co}`],
        })
    )
    let value = 0

    if (a.httpStatus === "Conflict") {
        //this means that the value does not exist so return 0
    } else {
        //this means that the value exists and is returned so return that.
        value = parseInt(a[0]);
    }

    //Now that we have the value, perform increment or decrement
    if (operation === "COMPLETE") {
        value = value + 1
    } else if (operation === "INCOMPLETE") {
        value = (value == 0 ? 0 : value - 1); //if value is 0 return 0 else return decremented value
    } else {
        //if code reaches here, then it is in an unstable state so respond with an error
        return {
            response: false,
            message: `Received an invalid value when aggregating for dataSet,${dataSet}.`
        }
    }

    return {
        response: true,
        value: value
    }

}

/**
 *
 * @param {{event,operation}} operation event and operation operation is either "COMPLETE" or "INCOMPLETE"
 */
export const Aggregate = async ({
    event,
    teiAttributeValues,
    operation,
    dataElements,
    categoryCombos,
    dataSets,
    orgUnit,
    programs,
    changeStatus,
    sampleDate
}) => {

    //get the programCode of the event
    let programCode = ""
    programs.forEach(program => {
        program.programStages.forEach(stage => {
            if (stage.id === event.programStage.id) {
                programCode = program.code
            }
        })
        CONSTANTS.codesOfProgramsToAggregate.push(program.code)
    })

    //check if program is part of the programs to aggregate
    if (CONSTANTS.codesOfProgramsToAggregate.indexOf(programCode) === -1) {
        //Then this program is not part of the programs which are aggregated
        return {
            response: true,
            message: "Ignored program"
        }
    }
    if( programCode === 'Sample Testing' || programCode === 'Sample Testing_HP' ){
        //Then this program is not part of the programs which are aggregated
        return {
            response: true,
            message: "Ignored program"
        }
    }

    changeStatus(true);
    //first get the metadata from the evens
    let locationDataElement = dataElements.attributeGroups[CONSTANTS.locationCode][0] //There is only one DataElement
    let locationData = event.values[locationDataElement]

    let pathogenDataElement = dataElements.attributeGroups[CONSTANTS.pathogenCode][0] //There is only one dataElements
    let pathogenData_old = event.values[pathogenDataElement]


    // new aggregation logic add based on Gander and age-range
    let organismDataValue = event.values["SaQe2REkGVw"] || event.values["u8VDCIwa3w4"]; // organism tracker-dataelement-value
    //let tei = trackedEntityInstance;
    //u8VDCIwa3w4
    let sex = teiAttributeValues["VXRRpqAdrdK"];
    let tempSex = '';
    if( sex === 'Male'){
        tempSex = 'M'
    }
    else if( sex === 'Female' ){
        tempSex = 'F'
    }
    else if( sex === 'Transgender' ){
        tempSex = 'T'
    }

    let age_dob = teiAttributeValues["DfXY7WHFzyc"];
    //let dateDiff_ms = Date.now() - new Date(age_dob).getTime();
    let dateDiff_ms = new Date(sampleDate).getTime() - new Date(age_dob).getTime();
    let age_diff = new Date(dateDiff_ms);

    let calculatedAge = Math.abs(age_diff.getUTCFullYear() - 1970);
    let age_range = "";
    if ( calculatedAge < 18 ){
        age_range = "0-17";
    }
    else if( calculatedAge > 17 && calculatedAge < 46 ){
        age_range = "18-45";
    }
    else if( calculatedAge > 45 && calculatedAge < 61 ){
        age_range = "46-60";
    }
    else if( calculatedAge > 60 && calculatedAge < 76 ){
        age_range = "61-75";
    }
    else if( calculatedAge > 75 ){
        age_range = ">75";
    }
    /*
    function calculate_age(dob) {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
    */

    //alert ( age_dob + " -- " + sex + " -- " + organismDataValue + " -- " + key);
    //let tempValue = 'ARIF18-45';
    //let tempKey = 'Lc7YC95p0km';

    let pathogenData = organismDataValue + tempSex + age_range; // aggregated dataelement code
    //console.log(age_range, tempSex,  organismDataValue, pathogenData );

    let sampleTypeDataElement = dataElements.attributeGroups[CONSTANTS.sampleTypeCode][0]
    let sampleTypeData = event.values[sampleTypeDataElement]

    let departmentDataElement = dataElements.attributeGroups[CONSTANTS.departmentCode][0]
    let departmentData = event.values[departmentDataElement]

    if(!(locationData && pathogenData && sampleTypeData && departmentData)){
        //if there is any missing data don't process the aggregation
        if(operation === "COMPLETE"){
            return {
                response: false,
                message: "Mandatory fields missing"
            }
        }else if (operation === "INCOMPLETE"){
            //if there is a missing data and incomplete is called, then don't
            //enforce aggregation because the operation might be delete.

            return {
                response: true,
                message: "Ignored aggregation"
            };
        }
    }

    //check if aggregation is called in the right position
    if(event.status.completed && operation === "COMPLETE"){
        //If event is complete and aggregate is called, ignore it
        return {
            response: true,
            message: "Event already completed."
        };
    }

    if((!event.status.completed) && operation === "INCOMPLETE"){
        //if Event is not completed and incomplete is called, don't process it because it is already not aggregated.
        return {
            response: true,
            message: "Ignored aggregation"
        };
    }

    let cc = categoryCombos[CONSTANTS.sampleLocationDepartmentCC_Code].id
    let cp = categoryCombos[CONSTANTS.sampleLocationDepartmentCC_Code].categoryOptions[locationData]
    cp = cp + ";" + categoryCombos[CONSTANTS.sampleLocationDepartmentCC_Code].categoryOptions[sampleTypeData]
    cp = cp + ";" + categoryCombos[CONSTANTS.sampleLocationDepartmentCC_Code].categoryOptions[departmentData]


    let importantValues = []
    Object.keys(event.values).forEach(value => {
        //loop through the values and look for result data elements if found one save that.
        if (event.values[value] !== "") {

            if (dataElements[value][CONSTANTS.customAttributeMetadataTypeIdentifier] === CONSTANTS.antibioticAttributeCode) {
                //This means that this data elemnt is an antibiotic result therefore add it to important values.

                let tempArray = [dataElements[value].code, event.values[value]]
                tempArray = tempArray.sort();
                let categoryOptionCombo = tempArray.join("");
                categoryOptionCombo = categoryCombos[CONSTANTS.antibioticCC_Code].categoryOptionCombos[categoryOptionCombo]
                importantValues.push(categoryOptionCombo)
            }
        }
    })
    let de = dataElements[pathogenData].id;
    let deAntibioticWise = dataElements[pathogenData + '_AW'].id;

    let coDefault = categoryCombos[CONSTANTS.defaultCC_code].categoryOptionCombos[CONSTANTS.defaultCC_code]
    let defaultDataSet = dataSets[CONSTANTS.defaultDataSetCode]
    let antibioticWiseDataSet = dataSets[CONSTANTS.antibioticWiseDataSetCode]

    let period = sampleDate.substring(0, 7).replace('-', "");

    //now every metadata is fetched so for each get and update the data.
    let defaultResponse = await getValue({
        period: period,
        dataSet: defaultDataSet,
        de: de,
        orgUnit: orgUnit,
        cc: cc,
        cp: cp,
        co: coDefault,
        operation: operation
    })

    let defaultValue = 0;
    if (defaultResponse.response) { //this means that there have been a successfull fetching of data
        defaultValue = defaultResponse.value
    } else {
        //if code reaches here, then it is in an unstable state so respond with an error
        changeStatus(false)
        return {
            response: false,
            message: defaultResponse.message
        }
    }

    try {
        let b = await post(
            request(`dataValues.json`, {
                options: [
                    `pe=${period}&ds=${defaultDataSet}&de=${de}&ou=${orgUnit}&cc=${cc}&cp=${cp}&value=${defaultValue}&co=${coDefault}`,
                ],
                data: {}
            })
        )
        console.error("Post request not working. Response received:", b)
        changeStatus(false)
        return {
            response: false,
            message: "Unable to send data to data set"
        }
    } catch (error) {
        if (error.toString().startsWith("SyntaxError: Unexpected end of JSON")) {
            //this is because post request doesn't send back a response and it is a successful request.

        } else {
            console.error("Error in posting default value", error);
            changeStatus(false)
            return {
                response: false,
                message: "Unable to send data to data set"
            }
        }
    }

    for (let index in importantValues) {
        let co = importantValues[index]

        let individualResponse = await getValue({
            period: period,
            dataSet: antibioticWiseDataSet,
            de: deAntibioticWise,
            cc: cc,
            cp: cp,
            co: co,
            orgUnit: orgUnit,
            operation: operation
        })

        let individualValue = 0

        if (individualResponse.response) { //this means that there have been a successfull fetching of data
            individualValue = individualResponse.value
        } else {
            changeStatus(false)
            //if code reaches here, then it is in an unstable state so respond with an error
            return {
                response: false,
                message: individualResponse.message
            }
        }
        try {
            let b = await post(
                request(`dataValues.json`, {
                    options: [
                        `pe=${period}&ds=${antibioticWiseDataSet}&de=${deAntibioticWise}&ou=${orgUnit}&cc=${cc}&cp=${cp}&value=${individualValue}&co=${co}`,
                    ],
                    data: {}
                })
            )
            //if code reaches here then it means that there is an error in the post request.
            console.error("Post request not working. Response received:", b)
            changeStatus(false)
            return {
                response: false,
                message: "Unable to aggregate data"
            }
        } catch (error) {
            if (error.toString().startsWith("SyntaxError: Unexpected end of JSON")) {
                //this is because post request doesn't send back a response and
                //The syntax error is because of a successfull post request.
            } else {
                //This means that the post is working properly
                console.error("Unable to post data", error)
                changeStatus(false)
                return {
                    response: false,
                    message: "Unable to aggregate data"
                }
            }
        }
    };

    changeStatus(false)
    return {
        response: true,
        message: "Successfull"
    };
}