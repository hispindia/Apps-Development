import { tableToExcel } from "./download";

const List = ({ data, loading }) => {
  const handleDownload = () => {
    tableToExcel('report-table', 'Client Search', 'Client Search')
  }

  return (
    <div style={{padding: "0px 20px"}}>
      <div style={{ display: "flex", justifyContent: "space-between"}}>
        <div style={{display:"flex", alignItems: "center", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>Migrant List</h2>
        {loading && <div className="loader"></div>}
        {(!loading && !data.length) ? <div id="noClient">(No Client available!)</div> : ''}
        </div>
        <div>
          {data.length ? <button className="btn" onClick={handleDownload}>Download as Excel</button> : ""}
        </div>
      </div>
      <a id="dlink" style={{display:"none"}}></a>
      {data.length ? <table id="report-table">
        <thead>
          <tr>
            <th>Client Code</th>
            <th>Last Name</th>
            <th>Sex</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map(li => (
             <tr>
                <td>{li[0]}</td>
                <td>{li[1]}</td>
                <td>{li[2]}</td>
                <td>{li[3]}</td>
              </tr>
            ))
          }
        </tbody>
      </table> : ''}

    </div>
  );
};

export default List;
