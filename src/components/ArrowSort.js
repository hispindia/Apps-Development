import React, {useState} from "react";

const ArrowSort = ({handleSort, quarter}) => {
    const [isArrowup, setIsArrowUp] = useState(false);
    const [isArrowDown, setIsArrowDown] = useState(false);
    
    const handleArrowUp = () => {
      setIsArrowDown(false);
      setIsArrowUp(!isArrowup);
      handleSort('up', quarter, !isArrowup)
    }
    const handleArrowDown = () => {
      setIsArrowUp(false);
      setIsArrowDown(!isArrowDown);
      handleSort('down', quarter, !isArrowDown)
    }
  return (
    <div className="d-flex flex-column float-end">
        <svg xmlns="http://www.w3.org/2000/svg" onClick={handleArrowUp} height="16" width="10" stroke="black"  stroke-width="30"  fill={isArrowup? "black":"white"} viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" stroke="black"  stroke-width="30"  fill={isArrowDown? "black":"white"} onClick={handleArrowDown} viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
    </div>
  );
};

export default ArrowSort;
