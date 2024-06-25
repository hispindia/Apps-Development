document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("saveMembershipDetailsBtn").addEventListener("click", function () {
        if (validateForm("membershipDetailsForm")) {
            let formData = collectMembershipDetailsFormData();
            pushToDHIS2(formData, "membershipDetailsForm");
        }
    });

    document.getElementById("saveInstitutionalDataBtn").addEventListener("click", function () {
        if (validateForm("institutionalDataForm")) {
            let eventPayload = collectInstitutionalData();
            pushEventToDHIS2(eventPayload, 'https://links.hispindia.org/ippf_co/api');
        }
    });

    document.getElementById("saveOrganisationalDataBtn").addEventListener("click", function () {
        if (validateForm("organisationalDataForm")) {
            let eventPayload = collectOrganisationalData();
            pushEventToDHIS2(eventPayload, 'https://links.hispindia.org/ippf_co/api');
        }
    });

    document.getElementById("keyDocumentsBtn").addEventListener("click", function () {
        if (validateForm("keyDocumentsForm")) {
            let eventPayload = collectKeyDocumentsData();
            // pushEventToDHIS2(eventPayload,  'https://links.hispindia.org/ippf_co/api');
        }
    });

    document.getElementById('nextButton').addEventListener('click', function () {
        var nextPanel = document.getElementById('panel-body-2');
        if (nextPanel.classList.contains('collapse')) {
            nextPanel.classList.remove('collapse');
            nextPanel.classList.add('show');
        }
    });

    document.getElementById('nextButton2').addEventListener('click', function () {
        var nextPanel = document.getElementById('panel-body-3');
        if (nextPanel.classList.contains('collapse')) {
            nextPanel.classList.remove('collapse');
            nextPanel.classList.add('show');
        }
    });

    document.getElementById('nextButton3').addEventListener('click', function () {
        var nextPanel = document.getElementById('panel-body-4');
        if (nextPanel.classList.contains('collapse')) {
            nextPanel.classList.remove('collapse');
            nextPanel.classList.add('show');
        }
    });

});

function validateForm(formId) {
    let isValid = true;
    let inputs = document.querySelectorAll(`#${formId} .form-control`);
    inputs.forEach(input => {
        if (!input.value.trim() && !input.disabled) {
            input.nextElementSibling.style.display = 'block';
            isValid = false;
        } else {
            input.nextElementSibling.style.display = 'none';
        }
    });
    return isValid;
}

function collectMembershipDetailsFormData() {
    const countryOfOperationValue = document.getElementById("countryOfOperation").value;
    const formulaGeneratedYear1_val = document.getElementById("formulaGeneratedYear1").value;
    const formulaGeneratedYear2_val = document.getElementById("formulaGeneratedYear2").value;
    const formulaGeneratedYear3_val = document.getElementById("formulaGeneratedYear3").value;
    const organisationNameO_val = document.getElementById("organisationNameO").value;
    const primaryContact_val = document.getElementById("primaryContact").value;
    const primaryContact_phone_val = document.getElementById("contact1").value;
    const primaryContact_phone2_val = document.getElementById("contact2").value;

    const today = formatDate(new Date());

    const tracker = {
        trackedEntityType: "XjSwTokefHP",
        orgUnit: "cOahRpxsjxl",
        attributes: [
            { attribute: "OgPuoRimaat", value: countryOfOperationValue },

            { attribute: "Lv8wUjXV8fl", value: organisationUnitCode },
            { attribute: "H7u3oJh2ifa", value: organisationUnitName },
            { attribute: "Nu5FHDVne91", value: RegionName },

            { attribute: "RUJcqfBvOSh", value: organisationNameO_val },
            { attribute: "HrHPzD3Talq", value: primaryContact_val },
            { attribute: "LBF4RP0hzNR", value: primaryContact_phone_val },
            { attribute: "MgoVYQLP3yT", value: primaryContact_phone2_val }
        ],
        enrollments: [
            {
                orgUnit: "cOahRpxsjxl",
                program: "F9wFxXnlgyk",
                enrollmentDate: today,
                incidentDate: today,
                dueDate: today,
                events: [
                    {
                        program: "F9wFxXnlgyk",
                        orgUnit: "cOahRpxsjxl",
                        eventDate: today,
                        status: "COMPLETED",
                        storeBy: userName,
                        programStage: "WCRytcUeLfD",
                        dataValues: [
                            { dataElement: "fkHkH5jcJV0", value: formulaGeneratedYear1_val },
                            { dataElement: "dhaMzFTSGrd", value: formulaGeneratedYear2_val },
                            { dataElement: "gQQoxkZsZnn", value: formulaGeneratedYear3_val },
                            { dataElement: "rTDJjf4crQ8", value: primaryContact_val },
                            { dataElement: "MHZT9VSJnOf", value: primaryContact_phone_val },
                            { dataElement: "I27jsFBwUnt", value: primaryContact_phone2_val }
                        ]
                    }
                ]
            }
        ]
    };

    return tracker;
}

function collectInstitutionalData() {

    let trackedEntityInstanceId = localStorage.getItem('trackedEntityInstanceId');
    console.log('Retrieved Tracked Entity Instance ID:', trackedEntityInstanceId);

    const countryOfOperationValue = document.getElementById("countryOfOperation").value;
    const address = document.getElementById("address").value;

    const executiveDirectorName = document.getElementById("executiveDirectorName").value;
    const executiveDirectorEmail = document.getElementById("executiveDirectorEmail").value;
    const executiveDirectorContact = document.getElementById("executiveDirectorPhone").value;

    const boardChairName = document.getElementById("boardChairName").value;
    const boardChairEmail = document.getElementById("boardChairEmail").value;
    const boardChairPhone = document.getElementById("boardChairPhone").value;

    const officeName1 = document.getElementById("officeName1").value;
    const officeEmail1 = document.getElementById("officeEmail1").value;
    const officePhone1 = document.getElementById("officePhone1").value;

    const officeName2 = document.getElementById("officeName2").value;
    const officeEmail2 = document.getElementById("officeEmail2").value;
    const officePhone2 = document.getElementById("officePhone2").value;

    const officeName3 = document.getElementById("officeName3").value;
    const officeEmail3 = document.getElementById("officeEmail3").value;
    const officePhone3 = document.getElementById("officePhone3").value;

    const boardName = document.getElementById("boardName").value;
    const boardEmail = document.getElementById("boardEmail").value;
    const boardContact = document.getElementById("boardContact").value;

    const programLead1Name = document.getElementById("programLead1Name").value;
    const programLead1Email = document.getElementById("programLead1Email").value;
    const programLead1Phone = document.getElementById("programLead1Phone").value;

    const programLead2Name = document.getElementById("programLead2Name").value;
    const programLead2Email = document.getElementById("programLead2Email").value;
    const programLead2Phone = document.getElementById("programLead2Phone").value;

    const financeLeadName = document.getElementById("financeLeadName").value;
    const financeLeadEmail = document.getElementById("financeLeadEmail").value;
    const financeLeadPhone = document.getElementById("financeLeadPhone").value;

    const programLeadSDate = document.getElementById("programLeadSDate").value;
    const programLeadEDate = document.getElementById("programLeadEDate").value;

    const periodValue = document.getElementById("periodSelect").value;

    const eventDate = formatDate(new Date());;

    const eventPayload = {
        trackedEntityInstance: trackedEntityInstanceId,
        program: "F9wFxXnlgyk",
        programStage: "WCRytcUeLfD",
        orgUnit: "cOahRpxsjxl",
        eventDate: eventDate,
        status: "COMPLETED",
        dataValues: [
            { dataElement: "eS8HHmy5krN", value: address },

            { dataElement: "Ctp6kmhwq86", value: executiveDirectorName },
            { dataElement: "yGutLB1Spaa", value: executiveDirectorEmail },
            { dataElement: "woWgpD819lF", value: executiveDirectorContact },

            { dataElement: "IuyGw22tqYj", value: boardChairName },
            { dataElement: "YTtJK3jqsnq", value: boardChairEmail },
            { dataElement: "CFF42nxFPgB", value: boardChairPhone },

            { dataElement: "BycCbaxB1Pu", value: officeName1 },
            { dataElement: "tt9p7BLGhT0", value: officeEmail1 },
            { dataElement: "Mzn08vVVZVt", value: officePhone1 },

            { dataElement: "MeCYmsrREyS", value: officeName2 },
            { dataElement: "qShxfRboswE", value: officeEmail2 },
            { dataElement: "XmDKyaE5SbW", value: officePhone2 },

            { dataElement: "QgqjdnD1a24", value: officeName3 },
            { dataElement: "QoFEoEFiPZd", value: officeEmail3 },
            { dataElement: "H2t9gnU6JKb", value: officePhone3 },

            { dataElement: "aA5UkYBNvbl", value: boardName },
            { dataElement: "k86jH9sSXSq", value: boardEmail },
            { dataElement: "oYpc136YNgW", value: boardContact },

            { dataElement: "HFyJ2WGQEda", value: programLead1Name },
            { dataElement: "qColDnIqDjT", value: programLead1Email },
            { dataElement: "vFhnYZHTxfr", value: programLead1Phone },

            { dataElement: "t9LCankavyt", value: programLead2Name },
            { dataElement: "sJpc63Pkpip", value: programLead2Email },
            { dataElement: "SDC9mqvdjhQ", value: programLead2Phone },

            { dataElement: "ptHCVnzUXQl", value: financeLeadName },
            { dataElement: "lea8lybuFI9", value: financeLeadEmail },
            { dataElement: "PZswZ4XFTku", value: financeLeadPhone },

            { dataElement: "nME0H9rEBz4", value: programLeadSDate },
            { dataElement: "leqtpPX6o97", value: programLeadEDate },

            { dataElement: "Cdxi6aNEkbf", value: periodValue },

        ]
    };

    return eventPayload;
}

function collectOrganisationalData() {

    let trackedEntityInstanceId = localStorage.getItem('trackedEntityInstanceId');
    console.log('Retrieved Tracked Entity Instance ID:', trackedEntityInstanceId);

    const periodStart = document.getElementById("periodStart").value;
    const periodEnd = document.getElementById("periodEnd").value;

    const fixedStaffValue = document.querySelector('input[name="fixedStaff"]:checked').value;
    const fixedVolunteerValue = document.querySelector('input[name="fixedVolunteer"]:checked').value;
    const organisationValue = document.querySelector('input[name="organisation-input"]:checked').value;
    const primaryfocousValue = document.querySelector('input[name="primaryfocous"]:checked').value;
    const secondaryValue = document.querySelector('input[name="secondaryfocus"]:checked').value;
    const youthGroupOrNetworkValue = document.getElementById("youthGroupOrNetwork").checked ? "true" : "false";
    const maBranchesValue = document.getElementById("maBranches").checked ? "true" : "false";
    const youthGroupOrNetworkNumberValue = document.getElementById("youthVolNum").value;
    const maBranchesNumValue = document.getElementById("numOfBranches").value;
    const advocacyPriority1Value = document.getElementById("advocacyPriority1").value;
    const advocacyPriority2Value = document.getElementById("advocacyPriority2").value;


    const eventDate = formatDate(new Date());;

    const eventPayload = {
        trackedEntityInstance: trackedEntityInstanceId,
        program: "F9wFxXnlgyk",
        programStage: "tBVRSw2h2pA",
        orgUnit: "cOahRpxsjxl",
        eventDate: eventDate,
        status: "COMPLETED",
        dataValues: [
            { dataElement: "bcrC5FlhCrh", value: periodStart },
            { dataElement: "pJpPTx4wJcL", value: periodEnd },
            { dataElement: "kovn3d3f6S3", value: fixedStaffValue },
            { dataElement: "CblclJFFlfV", value: fixedVolunteerValue },
            { dataElement: "KfenFbGtZsj", value: organisationValue },
            { dataElement: "zdWqftJFqGA", value: primaryfocousValue },
            { dataElement: "TKYN8eltlPO", value: secondaryValue },
            { dataElement: "ttOZ4zaMXji", value: youthGroupOrNetworkValue },
            { dataElement: "dQgZIHO74q5", value: youthGroupOrNetworkNumberValue },
            { dataElement: "UaETNe6k15k", value: maBranchesValue },
            { dataElement: "OvbPe9nCJOd", value: maBranchesNumValue },
            { dataElement: "ruUgWVq48ke", value: advocacyPriority1Value },
            { dataElement: "AqNCKTl9iU9", value: advocacyPriority2Value }

        ]
    };

    return eventPayload;
}


function collectKeyDocumentsData() {
    let trackedEntityInstanceId = localStorage.getItem('trackedEntityInstanceId');
    console.log('Retrieved Tracked Entity Instance ID:', trackedEntityInstanceId);
    const today = formatDate(new Date());
    const fileInput = document.getElementById("upload_imgs");
    const file = fileInput.files[0];

    const documentDate = today;

    const eventPayload = {
        program: "F9wFxXnlgyk",
        orgUnit: "cOahRpxsjxl",
        eventDate: today,
        status: "COMPLETED",
        storedBy: userName,
        programStage: "UzfHCTIm3AF",
        trackedEntityInstance: trackedEntityInstanceId,
        dataValues: [

        ]
    };

    if (file) {
        uploadFile(file)
            .then(response => {
                const fileResourceId = response.response.fileResource.id;
                eventPayload.dataValues.push({ dataElement: "bKxsu7ESMUh", value: fileResourceId });


                pushEventToDHIS2(eventPayload, 'https://links.hispindia.org/ippf_co/api');
            })
            .catch(error => {
                console.error("File upload failed:", error);
            });
    } else {

    }

    return eventPayload;
}
function uploadFile(file) {
    const url = 'https://links.hispindia.org/ippf_co/api/fileResources';
    const formData = new FormData();
    formData.append("file", file, file.name);

    return fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .catch(error => console.error('Error uploading file:', error));
}

function collectFormData(formId) {
    let formData = {};
    let inputs = document.querySelectorAll(`#${formId} .form-control`);
    inputs.forEach(input => {
        if (!input.disabled) {
            formData[input.id] = input.value;
        }
    });
    return formData;
}

function pushToDHIS2(formData, formId) {

    let apiUrl = 'https://links.hispindia.org/ippf_co/api/trackedEntityInstances';
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.status === 'OK' && data.response.importSummaries.length > 0) {
                let trackedEntityInstanceId = data.response.importSummaries[0].reference;
                console.log('Tracked Entity Instance ID:', trackedEntityInstanceId);
                localStorage.setItem('trackedEntityInstanceId', trackedEntityInstanceId);
            }
            alert('Data saved successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while saving data.');
        });
}

function pushEventToDHIS2(eventPayload, dhis2Url) {

    const apiUrl = `https://links.hispindia.org/ippf_co/api/events`;

    const headers = {
        'Content-Type': 'application/json',

    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(eventPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Event pushed successfully")
            if (data.status === 'OK' && data.response.importSummaries.length > 0) {
                let eventID = data.response.importSummaries[0].reference;
                console.log('eventID ID:', eventID);

                localStorage.setItem('eventID', eventID);
            }
            console.log(`Event pushed successfully: ${data.response}`);
        })
        .catch(error => {
            if (error.response) {
                console.error('Error:', error.response.data);
            } else if (error.request) {
                console.error('Error:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            console.error('Error pushing event:', error);
        });
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
