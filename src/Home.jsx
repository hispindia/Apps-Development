import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table, TableBody, TableRow, TableCell, Button } from "@dhis2/ui-core";
import ReactPaginate from "react-js-pagination";
import { CircularProgress } from "@material-ui/core";
import classes from "./App.module.css";
import "./Pagination.css"; // Custom CSS file for pagination

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
  const TotalEvent = activeEventList?.length;
  const pending = Data?.length;

  const fetchCategoryCombosOptionsDetails = async () => {
    try {
      const response = await fetch(
        "../../categoryCombos.json?paging=false&fields=id,displayName,code,categoryOptionCombos[id,displayName,code,categoryOptions[id,code,displayName]]",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      const categoryCombos = {};
      console.log("categoryCombos=======", categoryCombos);

      responseData.categoryCombos.forEach((categoryCombo) => {
        categoryCombo.categoryOptions = {};

        categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo) => {
          let categoryOptionCodes = [];

          categoryOptionCombo.categoryOptions.forEach((categoryOption) => {
            categoryOptionCodes.push(categoryOption.code);

            if (!categoryCombo.categoryOptions[categoryOption.code]) {
              categoryCombo.categoryOptions[categoryOption.code] =
                categoryOption.id;
            }
          });

          categoryOptionCodes = categoryOptionCodes.sort();
          const identifierWithOptionCodes = categoryOptionCodes.join("");
          categoryCombo.categoryOptionCombos[identifierWithOptionCodes] =
            categoryOptionCombo.id;
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
      const response = await fetch(
        "../../organisationUnits?level=1&fields=id,name",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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
  const getActiveEventList = async (rootOrgUnit) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `../../events.json?skipPaging=true&program=l23GiPXIhzS&orgUnit=v1oUZMLy8sK&ouMode=DESCENDANTS&status=ACTIVE&fields=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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
      const response = await fetch(
        "../../dataElements.json?paging=false&fields=id,code,displayName,formName,attributeValues[value,attribute[id,name]]",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      const dataElements = {};
      const dataElementObjects = { attributeGroups: {} };
      console.log("responseData///", responseData);

      responseData.dataElements.forEach((de) => {
        dataElements[de.id] = de.formName ? de.formName : de.displayName;
        console.log("de===========", de);
        de.attributeValues.forEach((attributeValue) => {
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
      return { attributeGroups: {} };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchDataElementsDetails();
      setDataElementObjects(result);
    };

    fetchData();
  }, []);
  const TeiDetails = async (teiID) => {
    try {
      const response = await fetch(
        `../../trackedEntityInstances/${teiID}.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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

  const postAggregatedDataValue = async (
    period,
    dataSet,
    de,
    orgUnit,
    cc,
    cp,
    co,
    defaultValue,
  ) => {
    try {
      const response = await fetch(
        `../../dataValues.json?paging=false&pe=${period}&ds=${dataSet}&de=${de}&ou=${orgUnit}&cc=${cc}&cp=${cp}&co=${co}&value=${defaultValue}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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

  const getAggregatedDataValue = async (
    period,
    dataSet,
    de,
    orgUnit,
    cc,
    cp,
    co,
  ) => {
    let defaultvalue = 0;

    try {
      const response = await fetch(
        `../../dataValues.json?paging=false&pe=${period}&ds=${dataSet}&de=${de}&ou=${orgUnit}&cc=${cc}&cp=${cp}&co=${co}`,
      );
      const data = await response.json();

      if (data.httpStatus === "Conflict") {
        // this means that the value does not exist so return 0
        return {
          response: true,
          value: 1,
        };
      } else {
        // this means that the value exists and is returned so return that.
        defaultvalue = parseInt(data[0]) + 1;
      }

      return {
        response: true,
        value: defaultvalue,
      };
    } catch (error) {
      // handle error
      console.error("Error fetching data:", error);

      return {
        response: true,
        value: defaultvalue,
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
      const coDefault =
        tempCategoryCombos[DEFAULT_CC_CODE].categoryOptionCombos[
          DEFAULT_CC_CODE
        ];

      const cCombo = categoryCombos.Antibioticprescription.id;

      const eventList = activeEventList;

      const getTeiAttributeValue = (teiResponse, attributeId) => {
        if (!teiResponse?.attributes) return "";

        const attrObj = teiResponse.attributes.find(
          (attr) => attr.attribute === attributeId,
        );

        return attrObj ? attrObj.value : "";
      }; // function to get the attribute value for specific Id
      const getAgeGroup = (age) => {
        if (age === null || age === undefined || age === "") return "";

        const numericAge = parseInt(age, 10);

        if (isNaN(numericAge)) return "";
        if (numericAge >= 0 && numericAge <= 2) return "0-2";
        if (numericAge >= 3 && numericAge <= 12) return "3-12";
        if (numericAge >= 13 && numericAge <= 17) return "13-17";
        if (numericAge >= 18 && numericAge <= 49) return "18-49";
        if (numericAge >= 50 && numericAge <= 69) return "50-69";
        if (numericAge > 70) return ">70";
        // if (numericAge >= 0 && numericAge <= 4) return "0-4";
        // if (numericAge >= 5 && numericAge <= 14) return "5-14";
        // if (numericAge >= 15 && numericAge <= 44) return "15-44";
        // if (numericAge >= 45 && numericAge <= 60) return "45-60";
        // if (numericAge > 60) return ">60";

        return "";
      }; // calculating the age Group from the age

      for (let i = 0; i < eventList.length; i++) {
        let rationality1DataTEI = "";
        let locationDataTEI = "";
        let therapy1DataTEI = "";
        let purposeOfSampleDataTEI = "";

        const organismDataTEIList = []; // ✅ MULTI organisms
        const ORGANISM_DATAELEMENT_IDS = [
          "NyvwQVM48pt", // Organism 1
          "bsSyJOsqs9c", // Organism 2
          "HNAzUCVo9Ef", // Organism 3
          "r3EBeH8JAOn",
          "P3o7Py0xmJf",
          "d65XJBtpnoN",
        ];
        const antibioticCategoryOptionComboUIDsTEI = [];
        let tempAggregateDE = "";
        let tempCategoryOptions = "";
        const aggregateorgUnit = eventList[i].orgUnit;

        const tempEventForUpdate = eventList[i];

        const isoPeriod = eventList[i].eventDate
          .split("T")[0]
          .substring(0, 7)
          .replace("-", "");

        let TrackedEntityId = eventList[i]?.trackedEntityInstance;
        const teiResponse = await TeiDetails(TrackedEntityId);
        console.log("TTTTTTTTTTTTTTTT", teiResponse);

        let patientGender = getTeiAttributeValue(teiResponse, "imDytkRwhGs"); // get the Gender of single event
        let patientAge = getTeiAttributeValue(teiResponse, "nPjc1MTpKnO"); // get the age
        console.log("patientAge", patientAge);
        console.log("patientGender", patientGender);

        let patientAgeGroup = getAgeGroup(patientAge); // calculate the age Group from age
        console.log("patientAgeGroup===========", patientAgeGroup);
        // ==========================
        // Collect Data Values
        // ==========================
        for (let j = 0; j < eventList[i].dataValues.length; j++) {
          const dv = eventList[i].dataValues[j];

          if (dv.dataElement === "zxKDqCNXTkn") rationality1DataTEI = dv.value;
          if (dv.dataElement === "oJjnZpO0Map") locationDataTEI = dv.value;
          if (dv.dataElement === "qZhuQxgR5ag") therapy1DataTEI = dv.value;
          // if (dv.dataElement === "l4kqMRq38bm")
          //   purposeOfSampleDataTEI = dv.value;

          // ✅ Collect ALL organisms
          if (ORGANISM_DATAELEMENT_IDS.includes(dv.dataElement) && dv.value) {
            organismDataTEIList.push(dv.value);
          }
        }

        // Remove duplicates (optional but safe)
        const uniqueOrganisms = [...new Set(organismDataTEIList)];

        // ==========================
        // Category Option Combo (ONCE per event)
        // ==========================
        if (
          rationality1DataTEI &&
          locationDataTEI &&
          therapy1DataTEI &&
          patientAgeGroup
        ) {
          let tempArray = [
            patientAgeGroup,
            rationality1DataTEI,
            locationDataTEI,
            therapy1DataTEI,
          ]; // make the category option combination

          tempArray.sort();
          const categoryOptionComboKey = tempArray.join("");

          const categoryOptionCombo =
            tempCategoryCombos["Antibioticprescription"].categoryOptionCombos[
              categoryOptionComboKey
            ];

          if (categoryOptionCombo) {
            antibioticCategoryOptionComboUIDsTEI.push(categoryOptionCombo); // push the category option combination Match Id
            console.log("Matched combo UID:", categoryOptionCombo);
          } else {
            console.error("No matching categoryOptionCombo:", tempArray);
          }
        }

        // ==========================
        // Category Options String
        // ==========================
        if (
          locationDataTEI &&
          therapy1DataTEI &&
          rationality1DataTEI &&
          patientAgeGroup
        ) {
          tempCategoryOptions =
            tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[
              locationDataTEI
            ] +
            ";" +
            tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[
              therapy1DataTEI
            ] +
            ";" +
            tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[
              rationality1DataTEI
            ] +
            ";" +
            tempCategoryCombos[ANTIBIOTIC_PRESCRIPTION_CODE].categoryOptions[
              patientAgeGroup
            ];

          console.log("tempCategoryOptions ===>", tempCategoryOptions);

          // =================================================
          // 🔁 PROCESS EACH ORGANISM (MAIN CHANGE)
          // =================================================
          function normalizeKey(value) {
            return value?.toString().trim();
          }

          function normalizeKeyFull(value) {
            return value
              ?.toString()
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/-/g, "");
          }

          for (const organismDataTEI of uniqueOrganisms) {
            console.log("Processing organism:", organismDataTEI);

            const normalizedOrganism = normalizeKey(organismDataTEI);

            // ==========================
            // BASE ORGANISM DE (NO GENDER)
            // ==========================
            let baseDeId = null;

            const baseNorm = normalizeKeyFull(normalizedOrganism);
            const genderNorm = normalizeKeyFull(patientGender);

            for (const key of Object.keys(dataElementObjects)) {
              const normKey = normalizeKeyFull(key);

              // 1️⃣ Exact organism match
              if (normKey === baseNorm) {
                baseDeId = dataElementObjects[key].id;
                break;
              }

              // 2️⃣ Organism + gender match (DIRECT PASS)
              if (normKey === baseNorm + genderNorm) {
                baseDeId = dataElementObjects[key].id;
                break;
              }
            }

            if (!baseDeId) {
              console.warn(
                "❌ No base DE found for organism:",
                normalizedOrganism,
                "gender:",
                patientGender,
              );
              continue; // this organism skipped
            }

            tempAggregateDE = baseDeId;

            // ==========================
            // DEFAULT AGGREGATE (ALWAYS POST)
            // ==========================
            let defaultValue = 0;

            const aggregatedDataValueGetResponse = await getAggregatedDataValue(
              isoPeriod,
              AntibioticPDataSet,
              tempAggregateDE,
              aggregateorgUnit,
              cCombo,
              tempCategoryOptions,
              coDefault,
            );

            if (aggregatedDataValueGetResponse?.response) {
              defaultValue = Number(aggregatedDataValueGetResponse.value) || 0;
            }

            // 🔴 ALWAYS POST
            await postAggregatedDataValue(
              isoPeriod,
              AntibioticPDataSet,
              tempAggregateDE,
              aggregateorgUnit,
              cCombo,
              tempCategoryOptions,
              coDefault,
              defaultValue,
            );

            // ==========================
            // GENDER-WISE (USING patientGender)
            // ==========================
            if (
              antibioticCategoryOptionComboUIDsTEI.length > 0 &&
              patientGender
            ) {
              let deAntibioticWise = null;

              const genderKey = patientGender.toString().trim();

              const keyWithDash = `${normalizedOrganism}-${genderKey}`;
              const keyWithoutDash = `${normalizedOrganism}${genderKey}`;

              if (dataElementObjects[keyWithDash]?.id) {
                deAntibioticWise = dataElementObjects[keyWithDash].id;
              } else if (dataElementObjects[keyWithoutDash]?.id) {
                deAntibioticWise = dataElementObjects[keyWithoutDash].id;
              }

              console.log("Gender-wise DE ===>", deAntibioticWise);

              if (!deAntibioticWise) {
                console.warn(
                  `❌ No gender-wise DE for ${normalizedOrganism} + ${patientGender}`,
                );
                continue;
              }

              for (const antiCategoryOptionCombo of antibioticCategoryOptionComboUIDsTEI) {
                let genderValue = 0;

                const genderGetResp = await getAggregatedDataValue(
                  isoPeriod,
                  AntibioticPDataSet,
                  deAntibioticWise,
                  aggregateorgUnit,
                  cCombo,
                  tempCategoryOptions,
                  antiCategoryOptionCombo,
                );

                if (genderGetResp?.response) {
                  genderValue = Number(genderGetResp.value) || 0;
                }

                // 🔴 ALWAYS POST (even if GET had no value)
                const aggregatedDataValuePostResponse =
                  await postAggregatedDataValue(
                    isoPeriod,
                    AntibioticPDataSet,
                    deAntibioticWise,
                    aggregateorgUnit,
                    cCombo,
                    tempCategoryOptions,
                    antiCategoryOptionCombo,
                    genderValue,
                  );

                console.log(
                  "Gender aggregate updated:",
                  aggregatedDataValuePostResponse,
                );
              }
            }
          }

          // ==========================
          // Update Event (ONCE per event)
          // ==========================
          const eventUpdateResponse = updateEventStatus(tempEventForUpdate);
          console.log(eventUpdateResponse);
        }
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

  const updateEventStatus = async (tempEvent) => {
    try {
      const updatedEvent = { ...tempEvent, status: "COMPLETED" };

      const response = await fetch(`../../events/${tempEvent.event}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
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

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 50; // Adjust this value to set the number of items per page

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  // var val = () => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentData = Data.slice(indexOfFirstItem, indexOfLastItem);
  //   console.log("current data", currentData);
  //   if (currentData !== undefined) {
  //     return currentData.map((ele, index) => {
  //       if (ele.program) {
  //         var dataValue = {};

  //         let date = [];
  //         let eventStatus = [];
  //         eventStatus["value"] = ele.status;
  //         date["value"] = ele.eventDate.substring(0, 10);
  //         console.log("ele =======",ele)
  //         for (let value of ele.dataValues) {
  //           if (value.dataElement === "C7w2oe6vuwr") {
  //             dataValue["1"] = value;
  //           }
  //           if (value.dataElement === "zxKDqCNXTkn") {
  //             dataValue["10"] = value;
  //           }
  //           if (value.dataElement === "oJjnZpO0Map") {
  //             dataValue["13"] = value; //location
  //           }
  //           if (value.dataElement === "KVYg3tnmNMU") {
  //             dataValue["7"] = value;
  //           }

  //           if (value.dataElement === "l4kqMRq38bm") {
  //             dataValue["10"] = value;
  //           }
  //           dataValue["6"] = date;

  //           dataValue["11"] = eventStatus;
  //         }

  //         // Conditionally initialize missing values
  //         if (!dataValue["1"]) {
  //           dataValue["1"] = { value: "" };
  //         }
  //         if (!dataValue["2"]) {
  //           dataValue["2"] = { value: "" };
  //         }
  //         if (!dataValue["3"]) {
  //           dataValue["3"] = { value: "" };
  //         }
  //         if (!dataValue["7"]) {
  //           dataValue["7"] = { value: "" };
  //         }
  //         if (!dataValue["10"]) {
  //           dataValue["10"] = { value: "" };
  //         }

  //         return (
  //           <>
  //             <TableRow key={index}>
  //               {Object.keys(dataValue).map((key) => (
  //                 <TableCell key={key}>{dataValue[key].value}</TableCell>
  //               ))}
  //             </TableRow>
  //           </>
  //         );
  //       }
  //     });
  //   }
  // };

  // return (
  //   <>
  //     <div style={{ padding: "10px" }}>
  //       <div style={{ marginLeft: "5px" }}>
  //         <Button primary={true} onClick={getEventList}>
  //           Aggregate
  //         </Button>
  //         {pendingstatus ? (
  //           <span style={{ paddingLeft: "10px" }}>
  //             Pending Events: {pending}
  //           </span>
  //         ) : (
  //           <span style={{ paddingLeft: "10px" }}>
  //             Total Events: {TotalEvent}
  //           </span>
  //         )}
  //       </div>

  //       <div>
  //         <Table>
  //           <TableRow className={classes.header}>
  //             <TableCell>
  //               <b>Organism</b>
  //             </TableCell>
  //             <TableCell>
  //               <b>Sample Type</b>
  //             </TableCell>
  //             <TableCell>
  //               <b>Location</b>
  //             </TableCell>
  //             <TableCell>
  //               <b>Event Date</b>
  //             </TableCell>

  //             <TableCell>
  //               <b>Purpose of sample</b>
  //             </TableCell>
  //             <TableCell>
  //               <b>Status</b>
  //             </TableCell>
  //           </TableRow>
  //           {isLoading || status ? (
  //             <div
  //               style={{
  //                 position: "absolute",
  //                 top: "50%",
  //                 left: "50%",
  //                 transform: "translate(-50%, -50%)",
  //               }}
  //             >
  //               <CircularProgress />
  //             </div>
  //           ) : (
  //             <TableBody>{val()}</TableBody>
  //           )}
  //         </Table>

  //         <ReactPaginate
  //           activePage={currentPage}
  //           itemsCountPerPage={itemsPerPage}
  //           totalItemsCount={Data.length}
  //           pageRangeDisplayed={5}
  //           onChange={handlePageChange}
  //           itemClass="page-item"
  //           linkClass="page-link"
  //         />
  //       </div>
  //     </div>
  //   </>
  // ================== Pagination State ==================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Adjust this value to set the number of items per page

  const handlePageChange = (pageNumber) => {
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

      return (
        <TableRow key={index}>
          {/* <TableCell>{organism}</TableCell> */}
          <TableCell>{ratinonal}</TableCell>
          <TableCell>{location}</TableCell>
          <TableCell>{eventDate}</TableCell>
          {/* <TableCell>{purposeOfSample}</TableCell> */}
          <TableCell>{eventStatus}</TableCell>
        </TableRow>
      );
    });
  };

  // ================== JSX RETURN PART ==================
  return (
    <>
      <div style={{ padding: "10px" }}>
        <div style={{ marginLeft: "5px" }}>
          <Button primary={true} onClick={getEventList}>
            Aggregate
          </Button>

          {pendingstatus ? (
            <span style={{ paddingLeft: "10px" }}>
              Pending Events: {pending}
            </span>
          ) : (
            <span style={{ paddingLeft: "10px" }}>
              Total Events: {TotalEvent}
            </span>
          )}
        </div>

        <div>
          <Table>
            <TableRow className={classes.header}>
              <TableCell>
                <b>Irrational </b>
              </TableCell>

              <TableCell>
                <b>Location</b>
              </TableCell>
              <TableCell>
                <b>Event Date</b>
              </TableCell>

              <TableCell>
                <b>Status</b>
              </TableCell>
            </TableRow>

            {isLoading || status ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <TableBody>{val()}</TableBody>
            )}
          </Table>

          <ReactPaginate
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={Data.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
