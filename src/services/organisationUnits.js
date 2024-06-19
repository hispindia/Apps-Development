
export const organisationUnits = {
    get: async () => {
      console.log(process.env)
      var url = `https://yemhis.org/epi/api/organisationUnits.json?fields=id,name,path`;
      let response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${process.env.REACT_APP_AUTH}`,
        },
      });
      let data = await response.json();
  
      return data;
    },
  };
  