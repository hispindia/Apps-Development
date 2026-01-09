import { useState } from "react";
import { HeaderBar } from "@dhis2/ui";
import { Provider } from "@dhis2/app-runtime";
import { dataApi, metadataApi } from "./api";
import SearchBar from "./SearchBar";
import List from "./List";

import "./App.css";

function App() {
  const [lastName, setLastName] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);

  const handleSubmit = async () => {
    setData([]);
    setLoading(true);
    setDisplay(true);
    const user = await metadataApi.getMe();
    const dataList = await dataApi.getTrackedEntityInstanceList(user.organisationUnits[0].id, lastName ? lastName : '%20', clientCode ? clientCode : '%20');
    setData(dataList.listGrid.rows);
    setLoading(false);
  }

  return (
    <>
      <Provider 
        config={{
          baseUrl: import.meta.env.VITE_BASE_URL,
          apiVersion: 40,
        }}>
        <HeaderBar appName={"Client Search"} />
      </Provider>
      <SearchBar 
        lastName={lastName} 
        setLastName={setLastName}
        clientCode={clientCode}
        setClientCode={setClientCode}
        handleSubmit={handleSubmit}
      />
      {display && <List loading={loading} data={data}/>}
    </>
  );
}

export default App;
