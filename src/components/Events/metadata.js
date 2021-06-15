import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiService } from "../../services/apiService";
import { LoadMetaData,translationDataElements,setLanguage,loadProgramRuleCondition, dateDataElements} from "../../redux/action/event";

 export const MetaData = () => {
  const dispatch = useDispatch();
  const metaDataLoading = useSelector(state => state.data.metaDataLoading)
  const programRulesCondition = useSelector(state => state.data.programRulesCondition)
useEffect(() => {
  if(metaDataLoading){
    ApiService.getMe().then(result => {
    ApiService.getDETranslation().then(res => {
      let translatedDE = []
      let dateDE = []
      for( let de of res.dataElements){
            if(de.valueType=="DATE" ){
              dateDE.push(de.id)
            }
           for(let language of de.translations){
             if(language.locale == result.settings.keyDbLocale && language.property=="FORM_NAME" ){
              let obj ={}
              obj.id=de.id
              obj.name=de.name
              obj.displayName=language.value
              translatedDE.push(obj)
             }
           }
      }
      dispatch(dateDataElements(dateDE))
      dispatch(translationDataElements(translatedDE));

    })
      dispatch(setLanguage(result.settings.keyDbLocale));
    })
    ApiService.getMetaData().then(res => {
      if (res.programs.length) {
        res.programs.forEach(program => {
          if(program.attributeValues.length){
            let attribute = []
            program.attributeValues.forEach( attr => {
             attribute[attr.attribute.code]=Boolean(attr.value);
            })
            program.attributeValues = attribute; 
          }
          if (program.programStages.length) {
            program.programStages.forEach(programStage => {
              if(programStage.attributeValues.length){
                let attribute = []
                programStage.attributeValues.forEach( attr => {
                 attribute[attr.attribute.code]=Boolean(attr.value);
                })
                programStage.attributeValues = attribute; 
              }
              let programStageDataElements = [];
              let dataElementIndex = [];
              let eventValues = [];
              programStage.programStageDataElements.forEach(psde => {
                eventValues[psde["dataElement"]["id"]] = "";
                programStageDataElements[psde["dataElement"]["id"]] = psde["compulsory"].toString();
              });
              programStage["eventValues"] = eventValues;
              programStage.programStageSections.forEach((programStageSection, index) => {
                let programSectionDataElements = [];
                programStageSection.dataElements.forEach(de => {
                  if (programStageDataElements[de.id]) {
                    de["required"] = programStageDataElements[de.id] == "false" ? false : true;
                  }
                  de["hide"] = false;
                  de["programRuleId"]= ""
                  programSectionDataElements[de.id] = de;
                  dataElementIndex[de.id] = index;
                });
                programStageSection.dataElements = programSectionDataElements;
                programStageSection.hide = false;
                dataElementIndex[programStageSection.id] = index;
              });
              programStage.programStageSections["dataElementIndex"] = dataElementIndex;
            });
          }
        });
  
        const programCondition = c => {
          const original = c;
          try {
            const variableDuplicated = c.match(/#\{.*?\}/g);
            const variables = [];
            if (!variableDuplicated) return c;
            variableDuplicated.forEach(duplicated => {
              if (variables.indexOf(duplicated) === -1) variables.push(duplicated);
            });
            variables.forEach(variable => {
              const name = variable.substring(2, variable.length - 1);
              const id = res.programRuleVariables.find(ruleVariable => ruleVariable.name === name).dataElement.id;
              c = c.replace(new RegExp("#{" + name + "}", "g"), "values['" + id + "']");
            });
          } catch (e) {
            console.warn("Improper condition:", original);
          }
          return c;
        };
         let programRulesCondition =[]
         for(let programRule of res.programRules ){
          programRulesCondition.push(programRule.condition)
         }
         dispatch(loadProgramRuleCondition(programRulesCondition));
        res.programRules.forEach(programRule => {
          programRule.condition = programCondition(programRule.condition);
        });
      }
      dispatch(LoadMetaData(res));
   });
  }
}, [metaDataLoading])
  return (
    <>
    </>
  );
};
