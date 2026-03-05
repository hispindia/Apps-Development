function printContent() {
    const el = document.getElementById('content').innerHTML;
    document.body.innerHTML = el;
    window.print();
    location.reload();
}
callFlow();
async function callFlow() {
    const FLOW_URL = "https://default56af9532501a404c995d80633a35c0.ac.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/5e4d6b6437544b798b93c2035d0a66bd/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qCVnbA5MH8um9u9Qwux6_xB0qlBxHgmHnNJ--kwPHOE"
    const response = await fetch(FLOW_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            eventUid: "abc123",
            action: "complete","orgUnit": "OU_01",
            program: "Prog_01",
            PresidentName: "sonu singh AXWPS8419G"
        })
    });

    const result = await response.json();

    console.log(result);

    if (result.status === "SUCCESS") {
        alert("Flow executed successfully");
    } else {
        alert("Flow failed");
    }
}

function getData() {
    const teiId = document.getElementById('teiId');
    var dataElement = [
        {
            vaccine: 'ဘီစီဂျီ',
            times: 'တစ်ကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'အသည်းရောင်အသားဝါ (ဘီ)',
            times: 'တစ်ကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဘီစီဂျီ',
            times: 'မွေးစတွင် မထိုးနှံခဲ့ပါက',
            ids: ['', '', '']
        }, {
            vaccine: 'ပိုလီယို',
            times: 'ပထမအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပြင်းထန်ဝမ်းပျက်ဝမ်းလျှော (ရိုတာ)',
            times: 'ပထမအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပြင်းထန်အဆုတ်ရောင် (ပီစီဗီ)',
            times: 'ပထမအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဆုံဆို့-ကြက်ညှာ-မေးခိုင်-အသည်းရောင် အသားဝါ (ဘီ)- <br/> ဦးနှောက်အမြှေးရောင် (ငါးမျိုးစပ်ကာကွယ်ဆေး)',
            times: 'ပထမအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပိုလီယို',
            times: 'ဒုတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပြင်းထန်ဝမ်းပျက်ဝမ်းလျှော (ရိုတာ)',
            times: 'ဒုတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပိုလီယိုကာကွယ်ဆေးထိုးဆေး',
            times: 'ပထမအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပြင်းထန်အဆုတ်ရောင် (ပီစီဗီ)',
            times: 'ဒုတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဆုံဆို့-ကြက်ညှာ-မေးခိုင်-အသည်းရောင် အသားဝါ (ဘီ)- <br/> ဦးနှောက်အမြှေးရောင် (ငါးမျိုးစပ်ကာကွယ်ဆေး)',
            times: 'ဒုတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပိုလီယိုကာကွယ်ဆေးထိုးဆေး',
            times: 'ဒုတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဝက်သက်-ဂျိုက်သိုး',
            times: 'ပထမအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဂျပန်ဦးနှောက်ရောင်',
            times: 'တစ်ကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပိုလီယို',
            times: 'တတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ပြင်းထန်အဆုတ်ရောင် (ပီစီဗီ)',
            times: 'တတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဆုံဆို့-ကြက်ညှာ-မေးခိုင်-အသည်းရောင် အသားဝါ (ဘီ)- <br/> ဦးနှောက်အမြှေးရောင် (ငါးမျိုးစပ်ကာကွယ်ဆေး)',
            times: 'တတိယအကြိမ',
            ids: ['', '', '']
        }, {
            vaccine: 'ဝက်သက်-ဂျိုက်သိုး',
            times: 'ဒုတိယအကြိမ်',
            ids: ['', '', '']
        }, {
            vaccine: 'ဆုံဆို့-ကြက်ညှာ-မေးခိုင်-အသည်းရောင် အသားဝါ (ဘီ)- <br/> ဦးနှောက်အမြှေးရောင် (ငါးမျိုးစပ်ကာကွယ်ဆေး)',
            times: 'ပထမထပ်ဆောင်း',
            ids: ['', '', '']
        }, {
            vaccine: 'ဆုံဆို့-မေးခိုင်',
            times: 'ဒုတိယထပ်ဆောင်း',
            ids: ['', '', '']
        }, {
            vaccine: 'သားအိမ်ခေါင်းကင်ဆာရောဂါကာကွယ်ဆေး',
            times: 'တစ်ကြိမ',
            ids: ['', '', '']
        }
    ]

    var tableBody = '';
    dataElement.forEach((de, index) => {
        if (index == 0) tableBody += `<tr><td rowspan="2">မွေးစ</td>`;
        else if (index == 2) tableBody += `<tr><td rowspan="5">(၂) လ</td>`;
        else if (index == 7) tableBody += `<tr><td rowspan="5">(၄) လ</td>`;
        else if (index == 12) tableBody += `<tr><td rowspan="3">(၉) လ</td>`;
        else if (index == 15) tableBody += `<tr><td rowspan="3">(၆) လ</td>`;
        else if (index == 18) tableBody += `<tr><td rowspan="2">(၁) နှစ်ခွဲ</td>`;
        else if (index == 20) tableBody += `<tr><td>(၅) နှစ်</td>`;
        else if (index == 21) tableBody += `<tr><td>(၉) နှစ်</td>`;
        else tableBody += `<tr>`
        tableBody += `<td style="border: 1px solid #ccc;">${de.vaccine}</td>
        <td style="border: 1px solid #ccc;">${de.times}</td>`;
        de.ids.forEach(id => {
            tableBody += `<td style="border: 1px solid #ccc;">${id}</td>`;
        })
        tableBody += '</tr>'
    })
    document.getElementById('tbody-first').innerHTML = tableBody;
    document.getElementById('tbody-second').innerHTML = tableBody;


}