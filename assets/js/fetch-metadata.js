const baseUrl = "https://links.hispindia.org/ippf_co";
const programUid = "F9wFxXnlgyk";
let organisationUnitCode = "";
let organisationUnitName = "";
let RegionName = "";
let userName = "";
let trackedEntityInstanceId = "";
let organisationUnitID = "";
let programID = "F9wFxXnlgyk";
let trackedEntityType = "XjSwTokefHP";
let att_country_opr = "OgPuoRimaat";

document.addEventListener("DOMContentLoaded", function () {
    async function fetchOrganizationUnitUid() {
        try {
            const response = await fetch(`${baseUrl}/api/me.json?fields=username,organisationUnits[*,parent[*]]`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (data.organisationUnits && data.organisationUnits.length > 0) {
                organisationUnitCode = data.organisationUnits[0].code;
                organisationUnitID = data.organisationUnits[0].id;
                organisationUnitName = data.organisationUnits[0].name;
                RegionName = data.organisationUnits[0].parent?.name || "";
                userName = data.username;
                // Fetch user data when the page loads
                fetchUserData(organisationUnitID, programID);
            }

        } catch (error) {
            console.error("Error fetching organization unit:", error);
        }
    }

    async function fetchUserData(organisationUnitID, programID) {
        const url = `https://links.hispindia.org/ippf_co/api/trackedEntityInstances.json?program=${programID}&ou=${organisationUnitID}`;
        const headers = {
            'Accept': 'application/json'
        };

        try {
            const response = await fetch(url, { headers: headers });
            const data = await response.json();

            if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
                const trackedEntityInstance = data.trackedEntityInstances[0];
                const attributes = trackedEntityInstance.attributes;
                const teiUid = trackedEntityInstance.trackedEntityInstance;
                let trackedEntityInstanceId = teiUid;
                localStorage.setItem('trackedEntityInstanceId', trackedEntityInstanceId);
                trackedEntityInstanceId = localStorage.getItem('trackedEntityInstanceId');
                fetchProgramStagesData(teiUid);
                populateFormFields(attributes, teiUid);
            } else {
                console.log("No data found for the organisation unit.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    function populateFormFields(attributes, teiUid) {
        attributes.forEach(attribute => {
            switch (attribute.displayName) {
                case "Country of Operation":
                    document.getElementById("countryOfOperation").value = attribute.value || "";
                    break;
                case "Organisation Code":
                    document.getElementById("organisationCode").value = attribute.value || "203"; // default value
                    break;
                case "Organisation Name (English)":
                    document.getElementById("organisationName").value = attribute.value || "FPA India (203)"; // default value
                    break;
                case "IPPF Region":
                    document.getElementById("ippfRegion").value = attribute.value || "SAR"; // default value
                    break;
                case "Organisation Name":
                    document.getElementById("organisationNameO").value = attribute.value || "";
                    break;
                case "Business plan contact person name":
                    document.getElementById("primaryContact").value = attribute.value || "";
                    break;
                case "Business plan contact person role":
                    document.getElementById("contact1").value = attribute.value || "";
                    break;
                case "Business plan contact person email":
                    document.getElementById("attremail1").value = attribute.value || "";
                    break;
                default:
                    break;
            }
        });


    }

    async function fetchProgramStagesData(trackedEntityInstanceId) {
        const url = `https://links.hispindia.org/ippf_co/api/tracker/events.json?trackedEntity=${trackedEntityInstanceId}&paging=false`;
        const headers = {
            'Accept': 'application/json'
        };

        try {
            const response = await fetch(url, { headers: headers });
            const data = await response.json();

            if (data.instances && data.instances.length > 0) {
                populateProgramStages(data.instances);
            } else {
                console.log("No program stages data found for the tracked entity instance.");
            }
        } catch (error) {
            console.error("Error fetching program stages data:", error);
        }
    }

    function populateProgramStages(instances) {
        instances.forEach((instance, index) => {
            const programStage = instance.programStage;
            const dataValues = instance.dataValues;
            switch (programStage) {
                //Membership Details
                case "WCRytcUeLfD":
                    dataValues.forEach(dataValue => {
                        console.log(`dataValue ${dataValue.dataElement} value:-- ${dataValue.value}  `);
                        switch (dataValue.dataElement) {
                            case "eS8HHmy5krN":
                                document.getElementById("address").value = dataValue.value || "";
                                break;
                            case "Ctp6kmhwq86":
                                document.getElementById("executiveDirectorName").value = dataValue.value || "";
                                break;
                            case "yGutLB1Spaa":
                                document.getElementById("executiveDirectorEmail").value = dataValue.value || "";
                                break;
                            case "woWgpD819lF":
                                document.getElementById("executiveDirectorPhone").value = dataValue.value || "";
                                break;

                            case "IuyGw22tqYj":
                                document.getElementById("boardChairName").value = dataValue.value || "";
                                break;
                            case "YTtJK3jqsnq":
                                document.getElementById("boardChairEmail").value = dataValue.value || "";
                                break;
                            case "CFF42nxFPgB":
                                document.getElementById("boardChairPhone").value = dataValue.value || "";
                                break;
                            case "BycCbaxB1Pu":
                                document.getElementById("officeName1").value = dataValue.value || "";
                                break;

                            case "tt9p7BLGhT0":
                                document.getElementById("officeEmail1").value = dataValue.value || "";
                                break;
                            case "Mzn08vVVZVt":
                                document.getElementById("officePhone1").value = dataValue.value || "";
                                break;
                            case "MeCYmsrREyS":
                                document.getElementById("officeName2").value = dataValue.value || "";
                                break;
                            case "qShxfRboswE":
                                document.getElementById("officeEmail2").value = dataValue.value || "";
                                break;

                            case "XmDKyaE5SbW":
                                document.getElementById("officePhone2").value = dataValue.value || "";
                                break;
                            case "QgqjdnD1a24":
                                document.getElementById("officeName3").value = dataValue.value || "";
                                break;
                            case "QoFEoEFiPZd":
                                document.getElementById("officeEmail3").value = dataValue.value || "";
                                break;
                            case "H2t9gnU6JKb":
                                document.getElementById("officePhone3").value = dataValue.value || "";
                                break;
                            case "aA5UkYBNvbl":
                                document.getElementById("boardName").value = dataValue.value || "";
                                break;
                            case "k86jH9sSXSq":
                                document.getElementById("boardEmail").value = dataValue.value || "";
                                break;
                            case "oYpc136YNgW":
                                document.getElementById("boardContact").value = dataValue.value || "";
                                break;
                            case "HFyJ2WGQEda":
                                document.getElementById("programLead1Name").value = dataValue.value || "";
                                break;
                            case "qColDnIqDjT":
                                document.getElementById("programLead1Email").value = dataValue.value || "";
                                break;
                            case "vFhnYZHTxfr":
                                document.getElementById("programLead1Phone").value = dataValue.value || "";
                                break;
                            case "t9LCankavyt":
                                document.getElementById("programLead2Name").value = dataValue.value || "";
                                break;
                            case "sJpc63Pkpip":
                                document.getElementById("programLead2Email").value = dataValue.value || "";
                                break;
                            case "SDC9mqvdjhQ":
                                document.getElementById("programLead2Phone").value = dataValue.value || "";
                                break;
                            case "ptHCVnzUXQl":
                                document.getElementById("financeLeadName").value = dataValue.value || "";
                                break;
                            case "lea8lybuFI9":
                                document.getElementById("financeLeadEmail").value = dataValue.value || "";
                                break;
                            case "PZswZ4XFTku":
                                document.getElementById("financeLeadPhone").value = dataValue.value || "";
                                break;

                            case "nME0H9rEBz4":
                                document.getElementById("programLeadSDate").value = dataValue.value || "";
                                break;

                            case "leqtpPX6o97":
                                document.getElementById("programLeadEDate").value = dataValue.value || "";
                                break;

                        }
                    });
                    break;
                //Key Docs    
                case "UzfHCTIm3AF":
                    dataValues.forEach(dataValue => {
                        switch (dataValue.dataElement) {
                            case "bKxsu7ESMUh":
                                handleFileResource(dataValue.value);
                                // document.getElementById("upload_imgs").value = dataValue.value || "";
                                break;
                            // // Add more cases for other data elements as needed
                        }
                    });
                    break;

                //org details    
                case "tBVRSw2h2pA":
                    dataValues.forEach(dataValue => {
                        switch (dataValue.dataElement) {
                            case "bcrC5FlhCrh":
                                document.getElementById("periodStart").value = dataValue.value || "";
                                break;

                            case "pJpPTx4wJcL":
                                document.getElementById("periodEnd").value = dataValue.value || "";
                                break;

                            case "kovn3d3f6S3":

                                setRadioValue('fixedStaff', dataValue.value || "");

                                break;

                            case "CblclJFFlfV":
                                setRadioValue('fixedVolunteer', dataValue.value || "");
                                break;

                            case "KfenFbGtZsj":
                                setRadioValue('organisation-input', dataValue.value || "");
                                break;

                            case "zdWqftJFqGA":
                                setRadioValue('primaryfocous', dataValue.value || "");
                                break;

                            case "TKYN8eltlPO":
                                setRadioValue('secondaryfocus', dataValue.value || "");

                                break;

                            case "ttOZ4zaMXji":
                                if (dataValue.value === "true") {

                                    setCheckboxState('youthGroupOrNetwork', true);

                                }
                                else {

                                    setCheckboxState('youthGroupOrNetwork', false);

                                }

                                break;

                            case "dQgZIHO74q5":
                                document.getElementById("youthVolNum").value = dataValue.value || "";
                                break;

                            case "UaETNe6k15k":

                                if (dataValue.value === "true") {
                                    setCheckboxState('maBranches', true);

                                }
                                else {
                                    setCheckboxState('maBranches', false);

                                }

                                break;

                            case "OvbPe9nCJOd":
                                document.getElementById("numOfBranches").value = dataValue.value || "";
                                break;

                            case "ruUgWVq48ke":
                                setSelectValue("advocacyPriority1", dataValue.value);

                                break;

                            case "AqNCKTl9iU9":
                                setSelectValue("advocacyPriority2", dataValue.value);
                                break;

                        }
                    });
                    break;

                default:
                    console.log(`ProgramStage ${programStage} not handled.`);
            }
        });
    }
    async function fetchFileResource(resourceId) {

        const apiUrl = `https://links.hispindia.org/ippf_co/api/fileResources/${resourceId}`;
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            alert(data)
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    function updateFileLabel(elementId, fileName) {
        const element = document.getElementById(elementId);
        if (element) {
            const fieldLabel = element.closest('.form-group').querySelector('label');
            if (fieldLabel) {
                fieldLabel.textContent = fileName;
            }
        }
    }

    async function handleFileResource(elementId) {

        const fileData = await fetchFileResource(elementId);

        if (fileData) {
            alert(fileData.displayName)
            updateFileLabel("uploadlogo1", fileData.displayName);
        }

    }
    function setRadioValue(groupName, value) {
        const radios = document.querySelectorAll(`input[name="${groupName}"]`);

        radios.forEach(radio => {
            if (radio.value === value) {
                radio.checked = true;
            }
        });
    }
    function setCheckboxValue(checkboxId, value) {
        const checkbox = document.getElementById(checkboxId);
        const description = checkbox.nextElementSibling.nextElementSibling;

        checkbox.checked = value;
        description.textContent = value ? "Yes" : "No";
    }
    function setCheckboxState(checkboxId, isChecked) {
        const checkbox = document.getElementById(checkboxId);
        checkbox.checked = isChecked;

        const description = checkbox.nextElementSibling.nextElementSibling;
        description.textContent = isChecked ? 'Yes' : 'No';
    }

    function setSelectValue(selectId, value) {
        const selectElement = document.getElementById(selectId);
        const options = selectElement.options;

        for (let i = 0; i < options.length; i++) {
            if (options[i].text === value) {
                selectElement.selectedIndex = i;
                selectElement.dispatchEvent(new Event('change'));
                break;
            }
        }
    }
    async function fetchProgramAttributes() {
        try {
            const response = await fetch(`${baseUrl}/api/programs/${programUid}?fields=programTrackedEntityAttributes[trackedEntityAttribute[*]]`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data.programTrackedEntityAttributes.map(attr => attr.trackedEntityAttribute);
        } catch (error) {
            console.error("Error fetching program attributes:", error);
            return [];
        }
    }

    async function fetchProgramDataElements() {
        try {
            const response = await fetch(`${baseUrl}/api/programs/${programUid}?fields=programStages[programStageDataElements[dataElement[*]]]`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            const dataElements = [];
            data.programStages.forEach(stage => {
                stage.programStageDataElements.forEach(psde => {
                    dataElements.push(psde.dataElement);
                });
            });
            return dataElements;
        } catch (error) {
            console.error("Error fetching program data elements:", error);
            return [];
        }
    }

    function formatDate(date) {
        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    async function updateFormFields() {
        await fetchOrganizationUnitUid();
        const attributes = await fetchProgramAttributes();
        const dataElements = await fetchProgramDataElements();

        if (attributes.length > 0) {

            const organisationCodeInput = document.querySelector("#organisationCode");
            if (organisationCodeInput) {
                organisationCodeInput.value = organisationUnitCode;
            }
            const organisationNameInput = document.querySelector("#organisationName");
            if (organisationNameInput) {
                const fpaIndiaButton = document.querySelector('.fa-building-o').closest('a');
                if (fpaIndiaButton) {
                    const fpaIndiaDiv = fpaIndiaButton.querySelector('div');
                    if (fpaIndiaDiv) {
                        fpaIndiaDiv.textContent = organisationUnitName;
                    }
                }
                organisationNameInput.value = organisationUnitName;
            }
            const ippfRegionInput = document.querySelector("#ippfRegion");
            const headerOrgIdInput = document.querySelector("#headerOrgId");
            const headerOrgName = document.querySelector("#headerOrgName");
            const headerOrgCode = document.querySelector("#headerOrgCode");
            if (ippfRegionInput) {
                ippfRegionInput.value = RegionName;
                headerOrgIdInput.value = RegionName;
                headerOrgName.value = organisationUnitName;
                headerOrgCode.value = organisationUnitCode;
            }

            attributes.forEach(attribute => {
                if (attribute.id === "OgPuoRimaat") {
                    const countryOfOperation = document.querySelector("#countryOfOperation");
                    if (countryOfOperation) {
                        const countryOfOperationLabel = countryOfOperation.closest('.form-group').querySelector('label');
                        if (countryOfOperationLabel) {
                            countryOfOperationLabel.textContent = attribute.displayFormName;
                        }
                    }
                }
                else if (attribute.id === "Lv8wUjXV8fl") {
                    const organisationCode = document.querySelector("#organisationCode");
                    if (organisationCode) {
                        const countryOfOperationLabel = organisationCode.closest('.form-group').querySelector('label');
                        if (countryOfOperationLabel) {
                            countryOfOperationLabel.textContent = attribute.displayFormName;
                        }
                    }
                }
                else if (attribute.id === "H7u3oJh2ifa") {


                    const organisationName = document.querySelector("#organisationName");
                    const OrgHeader = document.querySelector("#OrgHeader");
                    if (organisationName) {
                        const countryOfOperationLabel = organisationName.closest('.form-group').querySelector('label');
                        if (countryOfOperationLabel) {

                            countryOfOperationLabel.textContent = attribute.displayFormName;
                        }
                    }
                }

                else if (attribute.id === "RUJcqfBvOSh") {
                    const organisationName = document.querySelector("#organisationNameO");
                    if (organisationName) {
                        const countryOfOperationLabel = organisationName.closest('.form-group').querySelector('label');
                        if (countryOfOperationLabel) {
                            countryOfOperationLabel.textContent = attribute.displayFormName;
                        }
                    }
                }
                else if (attribute.id === "Nu5FHDVne91") {
                    const ippfRegion = document.querySelector("#ippfRegion");
                    if (ippfRegion) {
                        const countryOfOperationLabel = ippfRegion.closest('.form-group').querySelector('label');
                        if (countryOfOperationLabel) {
                            countryOfOperationLabel.textContent = attribute.displayFormName;
                        }
                    }
                }
                else if (attribute.id === "HrHPzD3Talq") {
                    const primaryContact = document.querySelector("#primaryContact");
                    if (primaryContact) {
                        const fieldLabel = primaryContact.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = attribute.displayFormName;
                        }
                    }
                }
                else if (attribute.id === "LBF4RP0hzNR") {
                    const contact1 = document.querySelector("#contact1");
                    if (contact1) {
                        const fieldLabel = contact1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = attribute.displayFormName;
                        }
                    }
                }
                else if (attribute.id === "MgoVYQLP3yT") {
                    const contact2 = document.querySelector("#attremail1");
                    if (contact2) {
                        const fieldLabel = contact2.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = attribute.displayFormName;
                        }
                    }
                }

            });
        }
        if (dataElements.length > 0) {

            dataElements.forEach(element => {
                if (element.id === "fkHkH5jcJV0") {
                    const formulaGeneratedYear1 = document.querySelector("#formulaGeneratedYear1");
                    if (formulaGeneratedYear1) {
                        const fieldLabel = formulaGeneratedYear1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "dhaMzFTSGrd") {
                    const formulaGeneratedYear2 = document.querySelector("#formulaGeneratedYear2");
                    if (formulaGeneratedYear2) {
                        const fieldLabel = formulaGeneratedYear2.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "gQQoxkZsZnn") {
                    const formulaGeneratedYear3 = document.querySelector("#formulaGeneratedYear3");
                    if (formulaGeneratedYear3) {
                        const fieldLabel = formulaGeneratedYear3.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "eS8HHmy5krN") {
                    const address = document.querySelector("#address");
                    if (address) {
                        const fieldLabel = address.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "Ctp6kmhwq86") {
                    const executiveDirectorName = document.querySelector("#executiveDirectorName");
                    if (executiveDirectorName) {
                        const fieldLabel = executiveDirectorName.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "yGutLB1Spaa") {
                    const executiveDirectorEmail = document.querySelector("#executiveDirectorEmail");
                    if (executiveDirectorEmail) {
                        const fieldLabel = executiveDirectorEmail.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "woWgpD819lF") {
                    const executiveDirectorPhone = document.querySelector("#executiveDirectorPhone");
                    if (executiveDirectorPhone) {
                        const fieldLabel = executiveDirectorPhone.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "IuyGw22tqYj") {
                    const boardChairName = document.querySelector("#boardChairName");
                    if (boardChairName) {
                        const fieldLabel = boardChairName.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "YTtJK3jqsnq") {
                    const boardChairEmail = document.querySelector("#boardChairEmail");
                    if (boardChairEmail) {
                        const fieldLabel = boardChairEmail.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "CFF42nxFPgB") {
                    const boardChairPhone = document.querySelector("#boardChairPhone");
                    if (boardChairPhone) {
                        const fieldLabel = boardChairPhone.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "BycCbaxB1Pu") {
                    const officeName1 = document.querySelector("#officeName1");
                    if (officeName1) {
                        const fieldLabel = officeName1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "tt9p7BLGhT0") {
                    const officeEmail1 = document.querySelector("#officeEmail1");
                    if (officeEmail1) {
                        const fieldLabel = officeEmail1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "Mzn08vVVZVt") {
                    const officePhone1 = document.querySelector("#officePhone1");
                    if (officePhone1) {
                        const fieldLabel = officePhone1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }


                if (element.id === "MeCYmsrREyS") {
                    const officeName2 = document.querySelector("#officeName2");
                    if (officeName2) {
                        const fieldLabel = officeName2.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "qShxfRboswE") {
                    const officeEmail2 = document.querySelector("#officeEmail2");
                    if (officeEmail2) {
                        const fieldLabel = officeEmail2.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "XmDKyaE5SbW") {
                    const officePhone2 = document.querySelector("#officePhone2");
                    if (officePhone2) {
                        const fieldLabel = officePhone2.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }


                if (element.id === "QgqjdnD1a24") {
                    const officeName3 = document.querySelector("#officeName3");
                    if (officeName3) {
                        const fieldLabel = officeName3.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "QoFEoEFiPZd") {
                    const officeEmail3 = document.querySelector("#officeEmail3");
                    if (officeEmail3) {
                        const fieldLabel = officeEmail3.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "H2t9gnU6JKb") {
                    const officePhone3 = document.querySelector("#officePhone3");
                    if (officePhone3) {
                        const fieldLabel = officePhone3.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }


                if (element.id === "aA5UkYBNvbl") {
                    const boardName = document.querySelector("#boardName");
                    if (boardName) {
                        const fieldLabel = boardName.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "k86jH9sSXSq") {
                    const boardEmail = document.querySelector("#boardEmail");
                    if (boardEmail) {
                        const fieldLabel = boardEmail.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "oYpc136YNgW") {
                    const boardContact = document.querySelector("#boardContact");
                    if (boardContact) {
                        const fieldLabel = boardContact.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }


                if (element.id === "HFyJ2WGQEda") {
                    const programLead1Name = document.querySelector("#programLead1Name");
                    if (programLead1Name) {
                        const fieldLabel = programLead1Name.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "qColDnIqDjT") {
                    const programLead1Email = document.querySelector("#programLead1Email");
                    if (programLead1Email) {
                        const fieldLabel = programLead1Email.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "vFhnYZHTxfr") {
                    const programLead1Phone = document.querySelector("#programLead1Phone");
                    if (programLead1Phone) {
                        const fieldLabel = programLead1Phone.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "t9LCankavyt") {
                    const programLead2Name = document.querySelector("#programLead2Name");
                    if (programLead2Name) {
                        const fieldLabel = programLead2Name.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "sJpc63Pkpip") {
                    const programLead2Email = document.querySelector("#programLead2Email");
                    if (programLead2Email) {
                        const fieldLabel = programLead2Email.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "SDC9mqvdjhQ") {
                    const programLead2Phone = document.querySelector("#programLead2Phone");
                    if (programLead2Phone) {
                        const fieldLabel = programLead2Phone.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "ptHCVnzUXQl") {
                    const financeLeadName = document.querySelector("#financeLeadName");
                    if (financeLeadName) {
                        const fieldLabel = financeLeadName.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "lea8lybuFI9") {
                    const financeLeadEmail = document.querySelector("#financeLeadEmail");
                    if (financeLeadEmail) {
                        const fieldLabel = financeLeadEmail.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "PZswZ4XFTku") {
                    const financeLeadPhone = document.querySelector("#financeLeadPhone");
                    if (financeLeadPhone) {
                        const fieldLabel = financeLeadPhone.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }


                if (element.id === "nME0H9rEBz4") {
                    const programLeadSDate = document.querySelector("#programLeadSDate");
                    if (programLeadSDate) {
                        const fieldLabel = programLeadSDate.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "leqtpPX6o97") {
                    const programLeadEDate = document.querySelector("#programLeadEDate");
                    if (programLeadEDate) {
                        const fieldLabel = programLeadEDate.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }


                if (element.id === "bKxsu7ESMUh") {

                    const uploadlogo1 = document.querySelector("#uploadlogo1");
                    if (uploadlogo1) {
                        const fieldLabel = uploadlogo1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "Enq2oH6Ql2q") {
                    const email1 = document.querySelector("#email1");
                    if (email1) {
                        const fieldLabel = email1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "ZDEVidWz60q") {
                    const explain1 = document.querySelector("#explain1");
                    if (explain1) {
                        const fieldLabel = explain1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "mF39vS47CiI") {
                    const uploadlogo2 = document.querySelector("#uploadlogo2");
                    if (uploadlogo2) {
                        const fieldLabel = uploadlogo2.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "b47w5sSS7FU") {
                    const negativeReports = document.querySelector("#negativeReports");
                    if (negativeReports) {
                        const fieldLabel = negativeReports.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "bJ28pWRVfTk") {
                    const negativeReports1 = document.querySelector("#negativeReports1");
                    if (negativeReports1) {
                        const fieldLabel = negativeReports1.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "bcrC5FlhCrh") {
                    const periodStart = document.querySelector("#periodStart");
                    if (periodStart) {
                        const fieldLabel = periodStart.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "pJpPTx4wJcL") {
                    const periodEnd = document.querySelector("#periodEnd");
                    if (periodEnd) {
                        const fieldLabel = periodEnd.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "pJpPTx4wJcL") {
                    const fixedStaffGroup = document.querySelector("#fixedStaffGroup");
                    if (fixed - fixedStaffGroup) {
                        const fieldLabel = fixedStaffGroup.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "KfenFbGtZsj") {
                    const typeOfOrg = document.querySelector("#typeOfOrg");
                    if (typeOfOrg) {
                        const fieldLabel = typeOfOrg.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }

                if (element.id === "bcrC5FlhCrh") {
                    const periodStart = document.querySelector("#periodStart");
                    if (periodStart) {
                        const fieldLabel = periodStart.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                if (element.id === "pJpPTx4wJcL") {
                    const periodEnd = document.querySelector("#periodEnd");
                    if (periodEnd) {
                        const fieldLabel = periodEnd.closest('.form-group').querySelector('label');
                        if (fieldLabel) {
                            fieldLabel.textContent = element.displayFormName;
                        }
                    }
                }
                document.getElementById('primary-focus-group').addEventListener('change', function (event) {
                    if (event.target.name === 'primary-focus') {
                        console.log('Selected value:', event.target.value);
                    }
                });

            });
        }
    }

    updateFormFields();
});
