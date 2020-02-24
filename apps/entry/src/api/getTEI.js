import {
    get
} from '@hisp-amr/api'

export const getTEI = async (orgUnit) => {
    var api = `trackedEntityInstances.json?ouMode=DESCENDANTS&program=L7bu48EI54J&ou=${orgUnit}`;
    var teiRows = []
    var response = await get(api);
    if (response.trackedEntityInstances) {
        response.trackedEntityInstances.forEach((teis, index) => {
            teiRows[index] = ["", "", "", "", "", ""];
            teis.attributes.forEach(tei => {
                if (tei.attribute == "nFrlz82c6jS") teiRows[index]["0"] = tei.value //CR Number
                if (tei.attribute == "D6QGzhnkKOW") teiRows[index]["1"] = tei.value //Name
                // if (tei.attribute == "nFrlz82c6jS") teiRows[index]["2"] = tei.value //Ward
                if (tei.attribute == "DfXY7WHFzyc") teiRows[index]["3"] = tei.value //Age
                if (tei.attribute == "VXRRpqAdrdK") teiRows[index]["4"] = tei.value //Sex
                if(tei.attribute == "ZgUp0jFVxdY") teiRows[index]["5"] = tei.value //Address
            })

        });
    }
    return teiRows;
}
