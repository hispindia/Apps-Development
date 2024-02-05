import React, {useEffect } from "react";
import "./styles.scss";

import { useDispatch, useSelector } from "react-redux";
import { setClickedOU, setOUChildren } from "../../store/outree/outree.action";

const OrganisationUnits = () => {
  const dispatch = useDispatch();
  const userOU = useSelector((state) => state.outree.userOU);
  const clickedOU = useSelector((state) => state.outree.clickedOU);

  useEffect(() => {
    if (clickedOU) {
      if (clickedOU.level == 1) dispatch(setOUChildren(clickedOU.children));
      else dispatch(setOUChildren([clickedOU]));
    }
  }, [clickedOU]);


  const handleClickedOU = (ou) => {
    dispatch(setClickedOU(ou));
  };

  return clickedOU && 
       <div className="ou-tree">
         <button
           type="button"
           className={clickedOU.id==userOU.id ? "btn btn-clicked mx-2 p-2":"btn btn-outline-secondary mx-2 p-2"}
           onClick={() => handleClickedOU(userOU)}
         >
           {userOU.name}
         </button>
         {userOU.children.map((ou) => {
           if (ou.id == "EYVrJAjlO4l" || ou.id == "JqSk9VNED0G") return;
           return (
             <button
               type="button"
               className={clickedOU.id==ou.id ? "btn btn-clicked mx-1":"btn btn-outline-secondary mx-1"}
               onClick={() => handleClickedOU(ou)}
             >
               {ou.name}
             </button>
           );
         })}
       </div>
  
};

export default OrganisationUnits;
