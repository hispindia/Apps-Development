import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/apiService'
const subject = new BehaviorSubject();
// console.log('here is sub', subject)
export const payloadService = {
passpayload: payload => subject.next({ payload }),
getpayload: () => subject.asObservable()
};
// ApiService.getMetaData().then(res => {
//     let programs =res.programs;
//     let pRules = res.programRules;
//     let programVariables = res.programRuleVariables;
//     let optionSets =res.optionSets
//     // console.log('HERE IS meta data', res, programs, pRules, res.programRuleVariables)
//     var programData = {
//         program: '',
//         programRules: [],
//         programRulesVariable: []

//     }
//     // for( let program of programs){
//     //     if(program.id === 'aYkLHnoPNo5'){
//     //         programData.program = program;
//     //         let  porgramStageDateElement= program.programStages[0].programStageDataElements;
//     //         console.log("here is program stage", program.programStages)
//     //         let  porgramStageDateElements = []
//     //         porgramStageDateElement.forEach(element => {
//     //          if(element.compulsory === true){ porgramStageDateElements.push(element)}
               
//     //         })
//     //         console.log(porgramStageDateElements)
//     //         let  programStageSections= program.programStages[0].programStageSections;
//     //              programStageSections.forEach( element => {
//     //              element.dataElements.forEach(element => {
//     //                 let optionSet = element.optionSet
//     //                 if(optionSet !== undefined){
//     //                 console.log(optionSet.id, optionSets )
//     //                 let optionsetArr = []
//     //                 optionSets.forEach( element => {
//     //                 if(element.id == optionSet.id){
//     //                     optionsetArr.push(element)
//     //                     console.log(element.id, optionSet.id)
//     //                 }
//     //                 })
//     //                 console.log(optionsetArr)


//     //                 }
//     //             })
//     //         })
//     //     }
//     // }
//     //  for(let pRule of pRules) {
//     //      if(pRule.program.id === 'aYkLHnoPNo5' ){
//     //             console.log("here is ids",  pRule.program.id);
//     //             programData.programRules.push(pRule);
//     //         }
//     //      }
//     // for(let variable of programVariables) {
//     //      if(variable.program.id === 'aYkLHnoPNo5'){
//     //         programData.programRulesVariable.push(variable);
//     //      }
//     //  }
//     // console.log("here is rules", programData);
// })
// var programId;
// var programDetails;
// ApiService.getProgramDetials().then( res => {
//     programId=res.id,
//     programDetails=res
//     // console.log("here is program Rules",programDetails)
// })
// ApiService.getProgramRules().then( res => {
//     let programRule = [];
//     let ProRules = res.programRules
//     for( let pRule of ProRules){
//         if(pRule.program.id === programId){
//             programRule.push(pRule)
//         }
//     }
//     programDetails['programRules'] =programRule
//     let programRulesVar =programDetails.programRuleVariables;
//     for (let pVar of programRulesVar){
//         let name = pVar.name
//         // console.log(name);
        
//     }
//     for ( let rule of programRule){
//         let exp = rule.condition
//         let val = exp.split("'") 
//         // console.log(val)
//     }
//     console.log("here is program Rulesdfsdfs", res.programRules, programDetails.programRuleVariables, programRule)
// })
