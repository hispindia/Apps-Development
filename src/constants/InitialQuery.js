
export const InitialQuery = {
  me: {
    resource: "me.json",
    params: {
      fields: ["id", "organisationUnits[id,name,level,code,path,children[id,name]]"],
    },
  },
  ouList: {
    resource: "organisationUnits.json",
    params: {
      fields: ["id,name,level,code,path,children[id,name]"],
      filter: 'level:in:[1,2]', 
      paging: false,
    },
  }
};