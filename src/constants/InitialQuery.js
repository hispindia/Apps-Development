
export const InitialQuery = {
  me: {
    resource: "me.json",
    params: {
      fields: ["id", "organisationUnits[id,name,level,code,path,children[id,name]]"],
    },
  },
};