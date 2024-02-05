import React, { useState, useEffect, useContext } from "react";
import "./styles.scss";

import { SelectPeriod } from "./Period";

import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setOUList,
  setSelectedOU,
  setUserOU,
} from "../../store/outree/outree.action";

import { Modal } from "../Modal";
import { setOUGroup, setSelectedGroup } from "../../store/navbar/navbar.action";

const NavBar = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);

  const selectedOU = useSelector((state) => state.outree.selectedOU);
  const clickedOU = useSelector((state) => state.outree.clickedOU);
  const ouGroup = useSelector((state) => state.navbar.ouGroup);
  const selectedGroup = useSelector((state) => state.navbar.selectedGroup);

  const dispatch = useDispatch();

  const tableToExcel = (function () {
      var uri = 'data:application/vnd.ms-excel;base64,'
          , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
          , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
          , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
      return function (table, name, filename) {
          if (!table.nodeType) table = document.getElementById(table)
          var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
          document.getElementById("dlink").href = uri + base64(format(template, ctx));
          document.getElementById("dlink").download = filename;
          document.getElementById("dlink").click();
      }
  })()

  useEffect(() => {
    if (data) {
      if (data.me) {
        dispatch(setUserOU(data.me.organisationUnits[0]));
        dispatch(setSelectedOU(data.me.organisationUnits[0]));
      }
      if (data.ouList) dispatch(setOUList(data.ouList.organisationUnits));
    }
  }, [data]);
    
  useEffect(() => {
    if (selectedOU) {
      const OUGroups = data.groupList.organisationUnitGroups;
      var groupArr = [{ name: "ALL IPA Units", ouList: [selectedOU] }];
      OUGroups.forEach((group) => {
        let ouList = group.organisationUnits.filter((ou) =>
          ou.path.includes(selectedOU.id)
        );
        if (ouList.length && ouList[0].id != selectedOU.id)
          groupArr.push({ name: group.name, ouList: ouList });
      });
      dispatch(setOUGroup(groupArr));
    }
  }, [selectedOU]);

  const handleModal = (bools) => {
    if (bools && clickedOU) dispatch(setSelectedOU(clickedOU));
    dispatch(setClickedOU(null));
    setOpenModal(!openModal);
  };

  const handleGroupChange = (e) => {
    const group = e.target.id;
    dispatch(setSelectedGroup(group));
  };
  return (
    <div>
      <div className="nav-container">
        {selectedOU && (
          <input
            type="text"
            value={selectedOU.name}
            onFocus={() => handleModal(false)}
          />
        )}

        <SelectPeriod />
        <div className="d-flex mb-0">
          {ouGroup &&
            ouGroup.map((group) => (
              <div
                key={group.name}
                id={group.name}
                className={
                  selectedGroup && group.name == selectedGroup
                    ? "active group"
                    : "group"
                }
                onClick={(e) => handleGroupChange(e)}
              >
                {group.name}
              </div>
            ))}
        </div>  
        <div class="flex-fill text-end">
          <button class="btn btn-success rounded-pill" onClick={() => tableToExcel('downloads', selectedGroup, selectedGroup+'.xls')}>Download as Excel</button>
        </div>
      </div>
      {openModal && <Modal handleModal={handleModal} />}
    </div>
  );
};

export default NavBar;
