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
    <div>
      <>
        <h6
          className={isClicked ? "ou clicked" : "ou fw-normal"}
          onClick={handleOUClick}
        >
          {currentOU.name}
        </h6>

        <ul className="ps-4">
          {displayChildren && currentOU.children
            ? currentOU.children
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((orgUnit) => (
                  <li>
                    {
                      <OrgUnitChildren
                        key={orgUnit}
                        orgUnit={orgUnit}
                        display={false}
                      />
                    }
                  </li>
                ))
            : ""}
        </ul>
      </>
    </div>
  );
};

export default OrgUnitChildren;
