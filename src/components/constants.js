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
};

export const ATTR_DE = [
  { id: "P3Spi0kT92n", name: "Client’s ID" },
  { id: "n2gG7cdigPc", name: "Client’s PrEP ID" },
  { id: "kQzpqh4JL7l", name: "Client’s Sex" },
  { id: "nVU4BU2jHc3", name: "State/Region" },
  { id: "x3s6CXPdNjd", name: "Township" },
  { id: "ouname", name: "Facility" },
  { id: "ts9LEoIEJWC", name: "PrEP Initiation Date" },
  { id: "event-date", name: "Last Visit Date at PrEP clinic " },
  { id: "icJeQiH7vf3", name: "Last PrEP ARV taken" },
  { id: "QB79pRV2LqV", name: "Last Next schedule Date" },
  {
    id: "missedDays",
    name: "Days of missed appointment since last schedule date",
  },
];
