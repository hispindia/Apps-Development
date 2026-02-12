// updating code for the same
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table, TableBody, TableRow, TableCell, Button } from "@dhis2/ui-core";
import ReactPaginate from "react-js-pagination";
import { CircularProgress } from "@material-ui/core";
import classes from "./App.module.css";
import "./Pagination.css"; // Custom CSS file for pagination
import { useNavigate } from "react-router-dom";
const Home = () => {
  const TRACKER_PROGRAM = "Uj0u5eXg0RK";
  const PROGRAM_ORG_UNIT = "PYHQttVvQU0";
  const ANTIBIOTIC_PRESCRIPTION_CODE = "Antibioticprescription";
  const customAttributeMetadataTypeIdentifier = "Metadata_type";
  const DEFAULT_CC_CODE = "default";
  const ORGANISMS_SAMPLE_WISE_DATASET = "oG3BlD3M9IE";
  const ORGANISMS_ANTIBIOTIC_DATASET = "CBsMJKLKkUQ";
  const ANTIBIOTIC_CATEGORY_COMBO_CODE = "antibiotic";
  const defaultCatCombOption = "HllvX50cXC0";
  const allOrganismsAntibioticWiseDataSet = "CBsMJKLKkUQ";
  const antibioticCategoryComboCode = "antibiotic";
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [dataElementObjects, setDataElementObjects] = useState(null);
  const [categoryCombos, setCategoryCombos] = useState(null);
  const [rootOrgUnit, setRootOrgUnit] = useState(null);
  const [activeEventList, setActiveEventList] = useState(null);
  const [Data, setData] = useState([]);
  // const [pending, setPending] = useState(0);
  const [pendingstatus, setPendingStatus] = useState(false);
  const TotalEvent = activeEventList === null || activeEventList === void 0 ? void 0 : activeEventList.length;
  const pending = Data === null || Data === void 0 ? void 0 : Data.length;
  const fetchCategoryCombosOptionsDetails = async () => {
    try {
      const response = await fetch("../../categoryCombos.json?paging=false&fields=id,displayName,code,categoryOptionCombos[id,displayName,code,categoryOptions[id,code,displayName]]", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseData = await response.json();
      const categoryCombos = {};
      console.log("categoryCombos=======", categoryCombos);
      responseData.categoryCombos.forEach(categoryCombo => {
        categoryCombo.categoryOptions = {};
        categoryCombo.categoryOptionCombos.forEach(categoryOptionCombo => {
          let categoryOptionCodes = [];
          categoryOptionCombo.categoryOptions.forEach(categoryOption => {
            categoryOptionCodes.push(categoryOption.code);
            if (!categoryCombo.categoryOptions[categoryOption.code]) {
              categoryCombo.categoryOptions[categoryOption.code] = categoryOption.id;
            }
          });
          categoryOptionCodes = categoryOptionCodes.sort();
          const identifierWithOptionCodes = categoryOptionCodes.join("");
          categoryCombo.categoryOptionCombos[identifierWithOptionCodes] = categoryOptionCombo.id;
          console.log("categoryOptionsCodes====", categoryOptionCodes);
        });
        categoryCombos[categoryCombo.code] = categoryCombo;
      });
      return categoryCombos;
    } catch (error) {
      console.error(error.message);
      return {};
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCategoryCombosOptionsDetails();
      setCategoryCombos(result);
    };
    fetchData();
  }, []);
  const getRootOrgUnit = async () => {
    try {
      const response = await fetch("../../organisationUnits?level=1&fields=id,name", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.organisationUnits;
    } catch (error) {
      console.error("Error fetching root organization unit", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await getRootOrgUnit();
      setRootOrgUnit(result[0].id);
    };
    fetchData();
  }, []);
  //https://ln2.hispindia.org/amr_vnimport/api/events.json?skipPaging=true&program=Uj0u5eXg0RK&orgUnit=YdrvIdocEMn&ouMode=DESCENDANTS&status=ACTIVE&filter=l9NuW9KD5mU:neq:NO GROWTH&filter=l9NuW9KD5mU:neq:No pathogen grown&filter=l9NuW9KD5mU:neq:CONTAMINANTS
  //../../events.json?skipPaging=true&program=Uj0u5eXg0RK&orgUnit=YdrvIdocEMn&ouMode=DESCENDANTS&status=ACTIVE&filter=l9NuW9KD5mU:neq:NO GROWTH
  const getActiveEventList = async rootOrgUnit => {
    setIsLoading(true);
    try {
      const response = await fetch(`../../events.json?skipPaging=true&program=l23GiPXIhzS&programStage=gFH6iolfh2J&orgUnit=v1oUZMLy8sK&ouMode=DESCENDANTS&status=ACTIVE&fields=*`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data.events;
    } catch (error) {
      console.error("Error fetching active event list", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await getActiveEventList(rootOrgUnit);
      setActiveEventList(result);
      setData(result);
    };
    fetchData();
  }, []);
  const fetchDataElementsDetails = async () => {
    try {
      const response = await fetch("../../dataElements.json?paging=false&fields=id,code,displayName,formName,attributeValues[value,attribute[id,name]]", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseData = await response.json();
      const dataElements = {};
      const dataElementObjects = {
        attributeGroups: {}
      };
      console.log("responseData///", responseData);
      responseData.dataElements.forEach(de => {
        dataElements[de.id] = de.formName ? de.formName : de.displayName;
        console.log("de===========", de);
        de.attributeValues.forEach(attributeValue => {
          de[attributeValue.attribute.id] = attributeValue.value;
          if (!dataElementObjects.attributeGroups[attributeValue.value]) {
            dataElementObjects.attributeGroups[attributeValue.value] = [];
          }
          dataElementObjects.attributeGroups[attributeValue.value].push(de.id);
        });
        dataElementObjects[de.id] = de;
        dataElementObjects[de.code] = de;
        console.log("dataElementObjects========", dataElementObjects);
      });
      return dataElementObjects;
    } catch (error) {
      console.error(error.message);
      return {
        attributeGroups: {}
      };
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchDataElementsDetails();
      setDataElementObjects(result);
    };
    fetchData();
  }, []);
  const TeiDetails = async teiID => {
    try {
      const response = await fetch(`../../trackedEntityInstances/${teiID}.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error.message);
      // return { attributeGroups: {} };
    }
  };
  const navigate = useNavigate();
  const postAggregatedDataValue = async (period, dataSet, de, orgUnit, cc, cp, co, defaultValue) => {
    try {
      const response = await fetch(`../../dataValues.json?paging=false&pe=${period}&ds=${dataSet}&de=${de}&ou=${orgUnit}&cc=${cc}&cp=${cp}&co=${co}&value=${defaultValue}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        // Handle error
        console.error("Error:", response);
        return null; // or throw an error
      }
      const aggregatedDataValuePostResponse = response;
      return aggregatedDataValuePostResponse;
    } catch (error) {
      console.error("Error:", error);
      return null; // or throw an error
    }
  };
  const getAggregatedDataValue = async (period, dataSet, de, orgUnit, cc, cp, co) => {
    let defaultvalue = 0;
    try {
      const response = await fetch(`../../dataValues.json?paging=false&pe=${period}&ds=${dataSet}&de=${de}&ou=${orgUnit}&cc=${cc}&cp=${cp}&co=${co}`);
      const data = await response.json();
      if (data.httpStatus === "Conflict") {
        // this means that the value does not exist so return 0
        return {
          response: true,
          value: 1
        };
      } else {
        // this means that the value exists and is returned so return that.
        defaultvalue = parseInt(data[0]) + 1;
      }
      return {
        response: true,
        value: defaultvalue
      };
    } catch (error) {
      // handle error
      console.error("Error fetching data:", error);
      return {
        response: true,
        value: defaultvalue
      };
    }
  };
  const tempCategoryCombos = categoryCombos;
  console.log("tempCategoryCombos+++++++++", tempCategoryCombos);
  const getEventList = async () => {
    alert("Aggeration is Started Click on Ok!");
    setStatus(true);
    try {
      const AntibioticPDataSet = "OL1AwznvNuS";
      const AntimicrobialDataSet = "aTVFyw659rT";
      //  let coDefault;
      const coDefault = tempCategoryCombos[DEFAULT_CC_CODE].categoryOptionCombos[DEFAULT_CC_CODE];
      const cCombo = categoryCombos.Antibioticprescription.id;
      const eventList = activeEventList;
      const getTeiAttributeValue = (teiResponse, attributeId) => {
        if (!(teiResponse !== null && teiResponse !== void 0 && teiResponse.attributes)) return "";
        const attrObj = teiResponse.attributes.find(attr => attr.attribute === attributeId);
        return attrObj ? attrObj.value : "";
      }; // function to get the attribute value for specific Id
      const getAgeGroup = age => {
        if (age === null || age === undefined || age === "") return "";
        const numericAge = parseInt(age, 10);
        if (isNaN(numericAge)) return "";
        if (numericAge >= 0 && numericAge <= 2) return "0-2";
        if (numericAge >= 3 && numericAge <= 12) return "3-12";
        if (numericAge >= 13 && numericAge <= 17) return "13-17";
        if (numericAge >= 18 && numericAge <= 49) return "18-49";
        if (numericAge >= 50 && numericAge <= 69) return "50-69";
        if (numericAge > 70) return ">70";
        return "";
      }; // calculating the age Group from the age

      // for (let i = 0; i < eventList.length; i++) {
      //   let locationDataTEI = "";
      //   let purposeOfSampleDataTEI = "";

      //   // ==========================
      //   // MULTI Rationality
      //   // ==========================
      //   const RATIONALITY_DATAELEMENT_IDS = [
      //     "zxKDqCNXTkn", // Organism 1
      //     "og7a4BdIriw", // Organism 2
      //     "jUu5GBcjU2P", // Organism 3
      //     "Oz5WM8SyQbf",
      //     "y4tVZyF76JP",
      //     "IwD9Bqz5oIW",
      //   ];
      //   const rationalityDataTEIList = [];

      //   // ==========================
      //   // MULTI Therapy
      //   // ==========================
      //   const THERAPY_DATAELEMENT_IDS = [
      //     "qZhuQxgR5ag",
      //     "JoVSWyfdyXY",
      //     "I4qgg3ccMIT",
      //     "TnBjw6vpu9K",
      //     "Fsi9Fw8ovEP",
      //     "w76Dd6hhcXv",
      //   ];
      //   const therapyDataTEIList = [];

      //   // ==========================
      //   // MULTI Organism
      //   // ==========================
      //   const organismDataTEIList = [];
      //   const ORGANISM_DATAELEMENT_IDS = [
      //     "NyvwQVM48pt",
      //     "bsSyJOsqs9c",
      //     "HNAzUCVo9Ef",
      //     "r3EBeH8JAOn",
      //     "P3o7Py0xmJf",
      //     "d65XJBtpnoN",
      //   ];

      //   const antibioticCategoryOptionComboUIDsTEI = [];
      //   let tempAggregateDE = "";
      //   let tempCategoryOptions = "";
      //   const aggregateorgUnit = eventList[i].orgUnit;
      //   const tempEventForUpdate = eventList[i];

      //   const isoPeriod = eventList[i].eventDate
      //     .split("T")[0]
      //     .substring(0, 7)
      //     .replace("-", "");

      //   let TrackedEntityId = eventList[i]?.trackedEntityInstance;
      //   const teiResponse = await TeiDetails(TrackedEntityId);

      //   let patientGender = getTeiAttributeValue(teiResponse, "imDytkRwhGs");
      //   let patientAge = getTeiAttributeValue(teiResponse, "nPjc1MTpKnO");
      //   let patientAgeGroup = getAgeGroup(patientAge);

      //   // ==========================
      //   // Collect Data Values
      //   // ==========================
      //   for (let j = 0; j < eventList[i].dataValues.length; j++) {
      //     const dv = eventList[i].dataValues[j];

      //     if (dv.dataElement === "oJjnZpO0Map") locationDataTEI = dv.value;

      //     // 🔴 NEW: Collect ALL Rationalities
      //     if (
      //       RATIONALITY_DATAELEMENT_IDS.includes(dv.dataElement) &&
      //       dv.value
      //     ) {
      //       rationalityDataTEIList.push(dv.value.trim());
      //     }

      //     // 🔴 NEW: Collect ALL Therapies
      //     if (THERAPY_DATAELEMENT_IDS.includes(dv.dataElement) && dv.value) {
      //       therapyDataTEIList.push(dv.value.trim());
      //     }

      //     // Existing: Collect ALL organisms
      //     if (ORGANISM_DATAELEMENT_IDS.includes(dv.dataElement) && dv.value) {
      //       organismDataTEIList.push(dv.value.trim());
      //     }
      //   }

      //   // ==========================
      //   // Deduplicate
      //   // ==========================
      //   const uniqueOrganisms = [...new Set(organismDataTEIList)];
      //   const uniqueRationalities = [...new Set(rationalityDataTEIList)];
      //   const uniqueTherapies = [...new Set(therapyDataTEIList)];

      //   console.log("Unique Rationalities:", uniqueRationalities);
      //   console.log("Unique Therapies:", uniqueTherapies);
      //   console.log("Unique Organisms:", uniqueOrganisms);

      //   // ==========================
      //   // MULTI CategoryOptionCombo (Rationality × Therapy)
      //   // ==========================
      //   if (
      //     locationDataTEI &&
      //     patientAgeGroup &&
      //     uniqueRationalities.length > 0 &&
      //     uniqueTherapies.length > 0
      //   ) {
      //     for (const rationalityValue of uniqueRationalities) {
      //       for (const therapyValue of uniqueTherapies) {
      //         let tempArray = [
      //           patientAgeGroup,
      //           rationalityValue,
      //           locationDataTEI,
      //           therapyValue,
      //         ];

      //         tempArray.sort();
      //         const categoryOptionComboKey = tempArray.join("");

      //         const categoryOptionCombo =
      //           tempCategoryCombos["Antibioticprescription"]
      //             .categoryOptionCombos[categoryOptionComboKey];

      //         if (categoryOptionCombo) {
      //           antibioticCategoryOptionComboUIDsTEI.push(categoryOptionCombo);
      //           console.log("Matched combo UID:", {
      //             rationalityValue,
      //             therapyValue,
      //             combo: categoryOptionCombo,
      //           });
      //         } else {
      //           console.error("No matching categoryOptionCombo:", tempArray);
      //         }
      //       }
      //     }
      //   }

      //   // =================================================
      //   // 🔁 PROCESS EACH ORGANISM (UNCHANGED CORE LOGIC)
      //   // BUT NOW LOOP OVER rationality × therapy
      //   // =================================================
      //   function normalizeKey(value) {
      //     return value?.toString().trim();
      //   }

      //   function normalizeKeyFull(value) {
      //     return value
      //       ?.toString()
      //       .trim()
      //       .toLowerCase()
      //       .replace(/\s+/g, "")
      //       .replace(/-/g, "");
      //   }

      //   for (const organismDataTEI of uniqueOrganisms) {
      //     const normalizedOrganism = normalizeKey(organismDataTEI);
      //     const baseNorm = normalizeKeyFull(normalizedOrganism);
      //     const genderNorm = normalizeKeyFull(patientGender);

      //     let baseDeId = null;

      //     for (const key of Object.keys(dataElementObjects)) {
      //       const normKey = normalizeKeyFull(key);

      //       if (normKey === baseNorm || normKey === baseNorm + genderNorm) {
      //         baseDeId = dataElementObjects[key].id;
      //         break;
      //       }
      //     }

      //     if (!baseDeId) continue;

      //     tempAggregateDE = baseDeId;

      //     // 🔴 LOOP Rationality × Therapy FOR CATEGORY OPTIONS
      //     for (const rationalityValue of uniqueRationalities) {
      //       for (const therapyValue of uniqueTherapies) {
      //         tempCategoryOptions =
      //           tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE]
      //             .categoryOptions[locationDataTEI] +
      //           ";" +
      //           tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE]
      //             .categoryOptions[therapyValue] +
      //           ";" +
      //           tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE]
      //             .categoryOptions[rationalityValue] +
      //           ";" +
      //           tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE]
      //             .categoryOptions[patientAgeGroup];

      //         let defaultValue = 0;

      //         const aggregatedDataValueGetResponse =
      //           await getAggregatedDataValue(
      //             isoPeriod,
      //             AntibioticPDataSet,
      //             tempAggregateDE,
      //             aggregateorgUnit,
      //             cCombo,
      //             tempCategoryOptions,
      //             coDefault,
      //           );

      //         if (aggregatedDataValueGetResponse?.response) {
      //           defaultValue =
      //             Number(aggregatedDataValueGetResponse.value) || 0;
      //         }

      //         await postAggregatedDataValue(
      //           isoPeriod,
      //           AntibioticPDataSet,
      //           tempAggregateDE,
      //           aggregateorgUnit,
      //           cCombo,
      //           tempCategoryOptions,
      //           coDefault,
      //           defaultValue,
      //         );
      //       }
      //     }
      //   }

      //   // ==========================
      //   // Update Event (ONCE per event)
      //   // ==========================
      //   const eventUpdateResponse = updateEventStatus(tempEventForUpdate);
      //   console.log(eventUpdateResponse);
      // }/// duplicates data push try 1

      for (let i = 0; i < eventList.length; i++) {
        var _eventList$i;
        let locationDataTEI = "";
        let purposeOfSampleDataTEI = "";

        // ==========================
        // MULTI Rationality / Therapy / Organism (SLOT DEFINITIONS)
        // ==========================
        const RATIONALITY_DATAELEMENT_IDS = ["zxKDqCNXTkn", "og7a4BdIriw", "jUu5GBcjU2P", "Oz5WM8SyQbf", "y4tVZyF76JP", "IwD9Bqz5oIW"];
        const THERAPY_DATAELEMENT_IDS = ["qZhuQxgR5ag", "JoVSWyfdyXY", "I4qgg3ccMIT", "TnBjw6vpu9K", "Fsi9Fw8ovEP", "w76Dd6hhcXv"];
        const ORGANISM_DATAELEMENT_IDS = ["NyvwQVM48pt", "bsSyJOsqs9c", "HNAzUCVo9Ef", "r3EBeH8JAOn", "P3o7Py0xmJf", "d65XJBtpnoN"];

        // Slot-aligned arrays
        const tempRationalities = [];
        const tempTherapies = [];
        const tempOrganisms = [];
        const aggregateorgUnit = eventList[i].orgUnit;
        const tempEventForUpdate = eventList[i];
        const isoPeriod = eventList[i].eventDate.split("T")[0].substring(0, 7).replace("-", "");
        let TrackedEntityId = (_eventList$i = eventList[i]) === null || _eventList$i === void 0 ? void 0 : _eventList$i.trackedEntityInstance;
        const teiResponse = await TeiDetails(TrackedEntityId);
        let patientGender = getTeiAttributeValue(teiResponse, "imDytkRwhGs");
        let patientAge = getTeiAttributeValue(teiResponse, "nPjc1MTpKnO");
        let patientAgeGroup = getAgeGroup(patientAge);

        // ==========================
        // Collect Data Values (SLOT-SAFE — ORDER INDEPENDENT)
        // ==========================
        for (let j = 0; j < eventList[i].dataValues.length; j++) {
          const dv = eventList[i].dataValues[j];
          if (dv.dataElement === "oJjnZpO0Map") {
            locationDataTEI = dv.value;
          }

          // ---- Rationality by slot ----
          const ratIdx = RATIONALITY_DATAELEMENT_IDS.indexOf(dv.dataElement);
          if (ratIdx !== -1 && dv.value) {
            tempRationalities[ratIdx] = dv.value.trim();
          }

          // ---- Therapy by slot ----
          const therIdx = THERAPY_DATAELEMENT_IDS.indexOf(dv.dataElement);
          if (therIdx !== -1 && dv.value) {
            tempTherapies[therIdx] = dv.value.trim();
          }

          // ---- Organism by slot ----
          const orgIdx = ORGANISM_DATAELEMENT_IDS.indexOf(dv.dataElement);
          if (orgIdx !== -1 && dv.value) {
            tempOrganisms[orgIdx] = dv.value.trim();
          }
        }

        // ==========================
        // Build MATCHED Triplets (TRUE ROW-WISE MATCHING)
        // ==========================
        const matchedTriplets = [];
        const maxLen = Math.max(ORGANISM_DATAELEMENT_IDS.length, RATIONALITY_DATAELEMENT_IDS.length, THERAPY_DATAELEMENT_IDS.length);
        for (let idx = 0; idx < maxLen; idx++) {
          if (tempOrganisms[idx] && tempRationalities[idx] && tempTherapies[idx]) {
            matchedTriplets.push({
              organism: tempOrganisms[idx],
              rationality: tempRationalities[idx],
              therapy: tempTherapies[idx],
              slot: idx + 1 // for debugging
            });
          }
        }
        console.log("Matched Triplets (slot-safe):", matchedTriplets);

        // ==========================
        // NORMALIZERS
        // ==========================
        function normalizeKey(value) {
          return value === null || value === void 0 ? void 0 : value.toString().trim();
        }
        function normalizeKeyFull(value) {
          return value === null || value === void 0 ? void 0 : value.toString().trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
        }

        // ==========================
        // PROCESS ONLY MATCHED TRIPLETS (DEDUP SAFE)
        // ==========================
        const processedAggregateKeys = new Set();
        for (const triplet of matchedTriplets) {
          const organismDataTEI = triplet.organism;
          const rationalityValue = triplet.rationality;
          const therapyValue = triplet.therapy;
          const normalizedOrganism = normalizeKey(organismDataTEI);
          const baseNorm = normalizeKeyFull(normalizedOrganism);
          const genderNorm = normalizeKeyFull(patientGender);
          let baseDeId = null;
          for (const key of Object.keys(dataElementObjects)) {
            const normKey = normalizeKeyFull(key);
            if (normKey === baseNorm || normKey === baseNorm + genderNorm) {
              baseDeId = dataElementObjects[key].id;
              break;
            }
          }
          if (!baseDeId) {
            console.warn("No DataElement found for organism:", organismDataTEI, "slot:", triplet.slot);
            continue;
          }
          const tempAggregateDE = baseDeId;

          // ==========================
          // Category Options (MATCHED)
          // ==========================
          const tempCategoryOptions = tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[locationDataTEI] + ";" + tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[therapyValue] + ";" + tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[rationalityValue] + ";" + tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[patientAgeGroup];

          // ✅ FINAL DEDUP KEY
          const aggregateKey = `${tempAggregateDE}||${tempCategoryOptions}`;
          if (processedAggregateKeys.has(aggregateKey)) {
            console.log("Skipping duplicate aggregate push:", aggregateKey, "slot:", triplet.slot);
            continue;
          }
          processedAggregateKeys.add(aggregateKey);
          let defaultValue = 0;
          const aggregatedDataValueGetResponse = await getAggregatedDataValue(isoPeriod, AntibioticPDataSet, tempAggregateDE, aggregateorgUnit, cCombo, tempCategoryOptions, coDefault);
          if (aggregatedDataValueGetResponse !== null && aggregatedDataValueGetResponse !== void 0 && aggregatedDataValueGetResponse.response) {
            defaultValue = Number(aggregatedDataValueGetResponse.value) || 0;
          }
          await postAggregatedDataValue(isoPeriod, AntibioticPDataSet, tempAggregateDE, aggregateorgUnit, cCombo, tempCategoryOptions, coDefault, defaultValue);
        }

        // ==========================
        // Update Event (ONCE per event)
        // ==========================
        const eventUpdateResponse = updateEventStatus(tempEventForUpdate);
        console.log(eventUpdateResponse);
      }
      console.log("cCobo+++++++++++", cCombo);
      setStatus(false);
      getActiveEventList();
      setData([]);
      setTimeout(function () {
        alert("Aggregation is done successfully");
      }, 2000);
      // setPending(eventList?.length);
      setPendingStatus(true);
    } catch (error) {
      console.error(error);
    }
  };
  const updateEventStatus = async tempEvent => {
    try {
      const updatedEvent = {
        ...tempEvent,
        status: "COMPLETED"
      };
      const response = await fetch(`../../events/${tempEvent.event}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedEvent)
      });
      if (!response.ok) {
        // Handle error
        console.error("Error:", response);
        return null; // or throw an error
      }
      const updateEventStatusResponse = await response.json();
      return updateEventStatusResponse;
    } catch (error) {
      console.error("Error:", error);
      return null; // or throw an error
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Adjust this value to set the number of items per page

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  // ================== Table Data Render ==================
  var val = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = Data.slice(indexOfFirstItem, indexOfLastItem);
    console.log("current data", currentData);
    if (!currentData || currentData.length === 0) return null;
    return currentData.map((ele, index) => {
      console.log("ele =======", ele);
      if (!ele.program) return null;

      // Defaults
      let organism = "";
      let ratinonal = "";
      let location = "";
      let eventDate = ele.eventDate ? ele.eventDate.substring(0, 10) : "";
      let purposeOfSample = "";
      let eventStatus = ele.status || "";
      if (ele.dataValues && ele.dataValues.length > 0) {
        for (let value of ele.dataValues) {
          // Organism
          // if (value.dataElement === "pNHNqJ1lOJh") {
          //   organism = value.value || "";
          // }

          // Sample Type / Purpose of sample
          if (value.dataElement === "zxKDqCNXTkn") {
            ratinonal = value.value || "";
            // purposeOfSample = value.value || "";
          }
          if (value.dataElement == "oJjnZpO0Map") {
            location = value.value || "";
          }
        }
      }
      return /*#__PURE__*/React.createElement(TableRow, {
        key: index
      }, /*#__PURE__*/React.createElement(TableCell, null, ratinonal), /*#__PURE__*/React.createElement(TableCell, null, location), /*#__PURE__*/React.createElement(TableCell, null, eventDate), /*#__PURE__*/React.createElement(TableCell, null, eventStatus));
    });
  };

  // ================== JSX RETURN PART ==================
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "5px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    primary: true,
    onClick: getEventList
  }, "Aggregate"), pendingstatus ? /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: "10px"
    }
  }, "Pending Events: ", pending) : /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: "10px"
    }
  }, "Total Events: ", TotalEvent)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableRow, {
    className: classes.header
  }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("b", null, "Irrational ")), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("b", null, "Location")), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("b", null, "Event Date")), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement("b", null, "Status"))), isLoading || status ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  }, /*#__PURE__*/React.createElement(CircularProgress, null)) : /*#__PURE__*/React.createElement(TableBody, null, val())), /*#__PURE__*/React.createElement(ReactPaginate, {
    activePage: currentPage,
    itemsCountPerPage: itemsPerPage,
    totalItemsCount: Data.length,
    pageRangeDisplayed: 5,
    onChange: handlePageChange,
    itemClass: "page-item",
    linkClass: "page-link"
  }))));
};
export default Home;