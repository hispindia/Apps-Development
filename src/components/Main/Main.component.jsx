import React  from "react";
import { useSelector } from "react-redux";
import "./styles.scss";
import TeiList from "../TeiList/TeiList.component";
import { tableToExcel } from "../utils.func";
import downloadIcon from '../../imgicon/download.png'


const Main = () => {
  const teiPresent = useSelector((state) => state.tei.teiPresent);
  const teiList = useSelector((state) => state.tei.list);
  const clickedOU = useSelector((state) => state.outree.clickedOU);
  return (
    <div className="flex-fill">
      <h3 className="py-2 mb-3 text-center text-decoration-underline">Missed Appointment List</h3>
      {
        (teiPresent && teiList.length) ?  (
          <div className="d-flex justify-content-end">
          <a id="dlink" style={{display:"none"}}></a>
          <button 
          className="btn-download"
          onClick={() => tableToExcel('download', 'list', `Missed-appointmentList-list${clickedOU.name}.xls`)}
          >
            <span className="fw-bold text-white">Download as Excel</span> <img src={downloadIcon} alt='download.png' height="30"/>
        </button>
        </div>
        ) : ''
      }
      <TeiList />
    </div>
  );
};

export default Main;
