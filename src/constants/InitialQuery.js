
export const InitialQuery = {
    me: {
      resource: "me.json",
      params: {
        fields: ["id", "organisationUnits[id,name,code,path"],
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
    groupList: {
      resource: "organisationUnitGroups.json",
      params: {
        fields: ["id,name,organisationUnits[id,name,path,ancestors[name]]"],
        paging: false,
      },
    },
  };