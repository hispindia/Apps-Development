
export const reportFilter = 'SCNP';
export const InitialQuery = {
  me: {
    resource: "me.json",
    params: {
      fields: ["id", "organisationUnits[id,name,code,path]"],
    },
  },
  ouList: {
    resource: "organisationUnits.json",
    params: {
      fields: ["id,name,code,path,children[id,name]"],
      withinUserHierarchy: true,
      paging: false,
    },
  },
  ouReports: {
    resource: "reports.json",
    params: {
      fields: ["id,name,reportParams"],
      paging: false
    }
  },
  ouGroups: {
    resource: "organisationUnitGroups.json",
    params: {
      fields:["id,name"],
      paging:false,
    }
  }
};

const SCRIPTS = [
  '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
  '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
]

const createScriptTag = script => {
  const src = process.env.REACT_APP_DHIS2_BASE_URL + script
  return `<script src="${src}" type="text/javascript"></script>`
}

export const wrapHtmlInTemplate = (html, ouGroup) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${SCRIPTS.map(createScriptTag).join('\n')}
            ${`<script type="text/javascript"> dhis2['ouGroup']='${ouGroup}'</script>`}
        </head>
        <body>
            ${html}
        </body>
    </html>`