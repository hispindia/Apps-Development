import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table, TableBody, TableRow, TableCell, Button } from "@dhis2/ui-core";
import ReactPaginate from "react-js-pagination";
import { CircularProgress } from "@material-ui/core";
import classes from "./App.module.css";
import "./Pagination.css"; // Custom CSS file for pagination

const Antimicrobial = () => {
  const TRACKER_PROGRAM = "Uj0u5eXg0RK";
  const PROGRAM_ORG_UNIT = "PYHQttVvQU0";
  const SPECIMEN_CODE = "Specimen and age";
  const DEFAULT_CC_CODE = "default";
  const ORGANISMS_SAMPLE_WISE_DATASET = "oG3BlD3M9IE";
  const ORGANISMS_ANTIBIOTIC_DATASET = "CBsMJKLKkUQ";
  const ANTIBIOTIC_CATEGORY_COMBO_CODE = "Antibiotic (AST)";
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
  // console.log("Total events", TotalEvent);
  // console.log("Data>>>", pending);
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
      const response = await fetch(`../../events.json?skipPaging=true&program=l23GiPXIhzS&programStage=hXaVY16tUqB&orgUnit=v1oUZMLy8sK&ouMode=DESCENDANTS&status=ACTIVE&fields=*`,
      // `../../events.json?skipPaging=true&program=l23GiPXIhzS&programStage=hXaVY16tUqB&orgUnit=YdrvIdocEMn&ouMode=DESCENDANTS&status=ACTIVE&filter=l9NuW9KD5mU:neq:NO GROWTH&filter=l9NuW9KD5mU:neq:No pathogen grown&filter=l9NuW9KD5mU:neq:CONTAMINANTS&filter=l9NuW9KD5mU:neq:NTP&filter=l9NuW9KD5mU:neq:Multiple organisms grown&filter=l4kqMRq38bm:neq:"`,
      {
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
      responseData.dataElements.forEach(de => {
        dataElements[de.id] = de.formName ? de.formName : de.displayName;
        de.attributeValues.forEach(attributeValue => {
          de[attributeValue.attribute.code] = attributeValue.value;
          if (!dataElementObjects.attributeGroups[attributeValue.value]) {
            dataElementObjects.attributeGroups[attributeValue.value] = [];
          }
          dataElementObjects.attributeGroups[attributeValue.value].push(de.id);
        });
        dataElementObjects[de.id] = de;
        dataElementObjects[de.code] = de;
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
  const tempCategoryCombos = categoryCombos;
  const getEventList = async () => {
    alert("Aggeration is Started Click on Ok!");
    setStatus(true);
    try {
      const headersMapGrpByDomain = {}; // Replace with actual data
      // const initialSummary = prepareListFromMap(headersMapGrpByDomain); // Uncomment if needed
      const importSummary = {};
      const importSummaryMap = [];
      const defaultDataSet = "oG3BlD3M9IE";
      const AntimicrobialDataSet = "aTVFyw659rT";
      // const coDefault =
      //   tempCategoryCombos[DEFAULT_CC_CODE].categoryOptionCombos[
      //     DEFAULT_CC_CODE
      //   ];
      let coDefault;
      if (tempCategoryCombos && tempCategoryCombos[DEFAULT_CC_CODE] && tempCategoryCombos[DEFAULT_CC_CODE].categoryOptionCombos && tempCategoryCombos[DEFAULT_CC_CODE].categoryOptionCombos[DEFAULT_CC_CODE]) {
        coDefault = tempCategoryCombos[DEFAULT_CC_CODE].categoryOptionCombos[DEFAULT_CC_CODE];
      }
      const cCombo = categoryCombos[SPECIMEN_CODE].id;
      const eventList = activeEventList;
      const getTeiAttributeValue = (teiResponse, attributeId) => {
        if (!(teiResponse !== null && teiResponse !== void 0 && teiResponse.attributes)) return "";
        const attrObj = teiResponse.attributes.find(attr => attr.attribute === attributeId);
        return attrObj ? attrObj.value : "";
      }; // function to get t
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
      }; // calculati

      for (let i = 0; i < eventList.length; i++) {
        var _eventList$i, _eventList$i$dataValu;
        let locationDataTEI = "";
        // let antibiotic = "";
        const antibioticCategoryOptionComboUIDsTEI = [];
        let tempAggregateDE = "";

        // ==========================
        // SLOT DEFINITIONS
        // ==========================
        const ORGANISM_DATAELEMENT_IDS = ["f2zuaxQte4X", "RZRyLBxDUdV", "KZxnGLKcK2m"];
        const SPECIMEN_DATAELEMENT_IDS = ["TOFStKOPw74", "Ig9Etz1lWPf", "BllGjdyk0jB"];
        const tempOrganisms = [];
        const tempSpecimens = [];
        const tempEventForUpdate = eventList[i];
        const aggregateorgUnit = eventList[i].orgUnit;
        const isoPeriod = eventList[i].eventDate.split("T")[0].substring(0, 7).replace("-", "");

        // ==========================
        // TEI + AGE/GENDER
        // ==========================
        let TrackedEntityId = (_eventList$i = eventList[i]) === null || _eventList$i === void 0 ? void 0 : _eventList$i.trackedEntityInstance;
        const teiResponse = await TeiDetails(TrackedEntityId);
        let antibiotic = ((_eventList$i$dataValu = eventList[i].dataValues.find(dv => dv.dataElement === "z3BBs2SoCZW")) === null || _eventList$i$dataValu === void 0 ? void 0 : _eventList$i$dataValu.value) || "";
        const getTeiAttributeValue = (teiResponse, attributeId) => {
          if (!(teiResponse !== null && teiResponse !== void 0 && teiResponse.attributes)) return "";
          const attrObj = teiResponse.attributes.find(attr => attr.attribute === attributeId);
          return attrObj ? attrObj.value : "";
        };
        const getAgeGroup = age => {
          const numericAge = parseInt(age, 10);
          if (isNaN(numericAge)) return "";
          if (numericAge <= 2) return "0-2";
          if (numericAge <= 12) return "3-12";
          if (numericAge <= 17) return "13-17";
          if (numericAge <= 49) return "18-49";
          if (numericAge <= 69) return "50-69";
          return ">70";
        };
        let patientAge = getTeiAttributeValue(teiResponse, "nPjc1MTpKnO");
        let patientGender = getTeiAttributeValue(teiResponse, "imDytkRwhGs");
        let patientAgeGroup = getAgeGroup(patientAge);

        // ==========================
        // COLLECT DATA VALUES (SLOT SAFE)
        // ==========================
        for (let j = 0; j < eventList[i].dataValues.length; j++) {
          const dv = eventList[i].dataValues[j];
          const deId = dv.dataElement; // STRING in your API

          const orgIdx = ORGANISM_DATAELEMENT_IDS.indexOf(deId);
          const speIdx = SPECIMEN_DATAELEMENT_IDS.indexOf(deId);
          if (orgIdx !== -1 && dv.value) {
            tempOrganisms[orgIdx] = dv.value.trim();
            console.log("FOUND ORGANISM:", orgIdx, dv.value);
          }
          if (speIdx !== -1 && dv.value) {
            tempSpecimens[speIdx] = dv.value.trim();
            console.log("FOUND ORGANISM:", speIdx, dv.value);
          }
          // if (eventList[i].dataValues[j].dataElement === "z3BBs2SoCZW") {
          //   antibiotic = eventList[i].dataValues[j].value;
          // }
          // ---- Specimen by slot ----

          // ==========================
          // Resistant / Intermediate / Susceptible
          // ==========================
          console.trace("HHHHH");
          if (dv.value === "Resistant" || dv.value === "Intermediate" || dv.value === "Susceptible") {
            let tempEventvalue = "";
            if (eventList[i].dataValues[j].value === "Resistant") {
              tempEventvalue = "Resistant";
            } else if (eventList[i].dataValues[j].value === "Intermediate") {
              tempEventvalue = "Intermediate";
            } else {
              tempEventvalue = "Susceptible";
            }
            const tempArray = [antibiotic,
            // dataElementObjects["z3BBs2SoCZW"]?.value,
            tempEventvalue].sort();
            console.log("TTTTTTTTTTTT", tempArray);
            let comboKey = tempArray.join("");
            const categoryOptionCombo = tempCategoryCombos[ANTIBIOTIC_CATEGORY_COMBO_CODE].categoryOptionCombos[comboKey];
            if (categoryOptionCombo) {
              antibioticCategoryOptionComboUIDsTEI.push(categoryOptionCombo);
            }
          }
        }

        // ==========================
        // BUILD MATCHED Organism + Specimen (SLOT SAFE)
        // ==========================
        const matchedTriplets = [];
        const maxLen = Math.max(ORGANISM_DATAELEMENT_IDS.length, SPECIMEN_DATAELEMENT_IDS.length);
        for (let idx = 0; idx < maxLen; idx++) {
          if (tempOrganisms[idx] && tempSpecimens[idx]) {
            matchedTriplets.push({
              organism: tempOrganisms[idx],
              specimen: tempSpecimens[idx],
              slot: idx + 1
            });
          }
        }
        console.log("Matched Organism+Specimen:", matchedTriplets);
        function normalizeKey(value) {
          return value === null || value === void 0 ? void 0 : value.toString().trim();
        }
        function normalizeKeyFull(value) {
          return value === null || value === void 0 ? void 0 : value.toString().trim().toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
        }
        // ==========================
        // PROCESS MATCHED ROWS
        // ==========================
        const processedAggregateKeys = new Set();
        for (const triplet of matchedTriplets) {
          const organismDataTEI = triplet.organism;
          const specimanDataTEI = triplet.specimen;
          const normalizedOrganism = normalizeKey(organismDataTEI);
          const baseNorm = normalizeKeyFull(normalizedOrganism);
          const ageNorm = normalizeKeyFull(patientAgeGroup); // 🔥 NEW
          const genderNorm = normalizeKeyFull(patientGender);
          let baseDeId = null;
          let matchedKey = null;
          for (const key of Object.keys(dataElementObjects)) {
            const normKey = normalizeKeyFull(key);

            // ==========================
            // TRY ALL SUPPORTED PATTERNS
            // ==========================
            if (normKey === baseNorm ||
            // ABA
            normKey === baseNorm + genderNorm
            // || // ABAFemale
            // normKey === baseNorm + ageNorm || // ABA0-2
            // normKey === baseNorm + ageNorm + genderNorm || // ABA0-2Female
            // normKey === baseNorm + genderNorm + ageNorm // ABAFemale0-2 (just in case)
            ) {
              baseDeId = dataElementObjects[key].id;
              matchedKey = key;
              break;
            }
          }
          if (!baseDeId) {
            console.warn("No DataElement found for organism:", organismDataTEI, "AgeGroup:", patientAgeGroup, "Gender:", patientGender, "slot:", triplet.slot);
            continue;
          }
          const tempAggregateDE = baseDeId;
          console.log("MATCHED DE:", matchedKey, "=>", tempAggregateDE, "for", organismDataTEI, patientAgeGroup, patientGender);
          const tempCategoryOptions = tempCategoryCombos[SPECIMEN_CODE].categoryOptions[specimanDataTEI] + ";" + tempCategoryCombos[SPECIMEN_CODE].categoryOptions[patientAgeGroup];
          // ";" +
          // tempCategoryCombos[SPECIMEN_CODE].categoryOptions[patientGender];

          // tempAggregateDE = dataElementObjects[organismDataTEI].id;
          console.log("CCCCCCCCCCCCCC", tempCategoryOptions);
          //           const aggregateKey = `${tempAggregateDE}||${tempCategoryOptions}`;
          // console.log("aaaaaaaaaaa",aggregateKey)
          //           if (processedAggregateKeys.has(aggregateKey)) {
          //             console.log(
          //               "Skipping duplicate aggregate push:",
          //               aggregateKey,
          //               "slot:",
          //               triplet.slot,
          //             );
          //             continue;
          //           }

          //           processedAggregateKeys.add(aggregateKey);

          // let aggregatedDataValueGetResponse = await getAggregatedDataValue(
          //   isoPeriod,
          //   defaultDataSet,
          //   tempAggregateDE,
          //   aggregateorgUnit,
          //   cCombo,
          //   tempCategoryOptions,
          //   coDefault,
          // );

          // let defaultValue = aggregatedDataValueGetResponse?.value || 0;

          // await postAggregatedDataValue(
          //   isoPeriod,
          //   defaultDataSet,
          //   tempAggregateDE,
          //   aggregateorgUnit,
          //   cCombo,
          //   tempCategoryOptions,
          //   coDefault,
          //   defaultValue,
          // );

          // ==========================
          // ANTIBIOTIC WISE (AW)
          // ==========================
          if (antibioticCategoryOptionComboUIDsTEI.length > 0) {
            //   const awKey = `${organismDataTEI}`;

            //   if (dataElementObjects[awKey]) {
            //     const deAntibioticWise = dataElementObjects[awKey].id;

            for (const antiCategoryOptionCombo of antibioticCategoryOptionComboUIDsTEI) {
              const aggregateKey = `${tempAggregateDE}||${tempCategoryOptions}`;
              if (processedAggregateKeys.has(aggregateKey)) {
                console.log("Skipping duplicate aggregate push:", aggregateKey, "slot:", triplet.slot);
                continue;
              }
              processedAggregateKeys.add(aggregateKey);
              let defaultValue = 0;
              const aggregatedDataValueGetResponse = await getAggregatedDataValue(
              // isoPeriod,
              "202601", AntimicrobialDataSet, tempAggregateDE, aggregateorgUnit, cCombo, tempCategoryOptions, antiCategoryOptionCombo, coDefault);
              if (aggregatedDataValueGetResponse !== null && aggregatedDataValueGetResponse !== void 0 && aggregatedDataValueGetResponse.response) {
                defaultValue = Number(aggregatedDataValueGetResponse.value) || 0;
              }
              await postAggregatedDataValue(
              // isoPeriod,
              "202601", AntimicrobialDataSet, tempAggregateDE, aggregateorgUnit, cCombo, tempCategoryOptions, coDefault, defaultValue);
            }
          }
        }
        // }

        // ==========================
        // UPDATE EVENT ONCE
        // ==========================
        const eventUpdateResponse = updateEventStatus(tempEventForUpdate);
        console.log(eventUpdateResponse);
      }
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
export default Antimicrobial;