
export const organisationUnits = {
    get: async () => {
      var url = `${process.env.REACT_APP_URL}/organisationUnits.json?fields=id,name,path`;
      let response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
      });
      let data = await response.json();
  
      return data;
    },
  };
  