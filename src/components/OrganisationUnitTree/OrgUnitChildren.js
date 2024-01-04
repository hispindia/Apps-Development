import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedOU } from "../../store/outree/outree.action";

const OrgUnitChildren = ({ orgUnit, display }) => {
  const dispatch = useDispatch();

  const ouList = useSelector((state) => state.outree.ouList);
  const clickedOU = useSelector((state) => state.outree.clickedOU);

  const [currentOU, setCurrentOU] = useState(orgUnit);
  const [displayChildren, setDisplayChildren] = useState(display);

  useEffect(() => {
    if (orgUnit && ouList.length) {
      const currentOU = ouList.filter((ou) => orgUnit.id == ou.id);
      setCurrentOU(currentOU[0]);
    }
  }, [orgUnit, ouList]);

  const handleOUClick = () => {
    setDisplayChildren(!displayChildren);
    dispatch(setClickedOU(currentOU));
  };

  const isClicked = clickedOU && currentOU.id == clickedOU.id ? true : false;

  return (
    <div className={currentOU.id=="EYVrJAjlO4l" || currentOU.id=="JqSk9VNED0G" ? 'd-none': ''}>
        <h6
          className={isClicked ? "ou ou-clicked" : "ou fw-normal"}
          onClick={handleOUClick}
        >
          {(currentOU.level==1) ? (displayChildren ? <span>&#9662;</span> : <span>&#9656;</span>) : ''}
          {currentOU.name}
        </h6>

        <ul className="ps-4">
          {displayChildren && currentOU.children && currentOU.level==1
            ? currentOU.children
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((orgUnit) => (
                  <li key={orgUnit.id} >
                    {
                      <OrgUnitChildren
                        orgUnit={orgUnit}
                        display={false}
                      />
                    }
                  </li>
                ))
            : ""}
        </ul>
    </div>
  );
};

export default OrgUnitChildren;
