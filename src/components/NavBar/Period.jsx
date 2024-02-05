import React, { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';

import { setPeriod } from "../../store/navbar/navbar.action";

const startYear = "2022";
const quaterYear = ["Jan - Mar", "Apr - Jun", "Jul - Sep", "Oct - Dec"];
const quaterNum = ["Q1", "Q2", "Q3", "Q4"];

const getQuaterlyData = (startYear) => {
  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();
  var options = [];
  const value = [];

  for (let i = startYear; i <= currYear; i++) {
    let quater = 3;
    if (i == currYear) {
      if (currMonth >= 0 && currMonth <= 2) quater = 0;
      else if (currMonth >= 3 && currMonth <= 5) quater = 1;
      else if (currMonth >= 6 && currMonth <= 8) quater = 2;
      else if (currMonth >= 9 && currMonth <= 11) quater = 3;
    }
    for (let j = 0; j <= quater; j++) {
      value.push(`${i}${quaterNum[j]}`);
      options.push([value.join(";"), `${quaterYear[j]} ${i}`]);
    }
  }
  return options;
};

export const SelectPeriod = () => {
  const dispatch = useDispatch();
  const period = useSelector(state => state.navbar.period);

  const options = getQuaterlyData(startYear);
  useEffect(() => {
    dispatch(setPeriod(options[options.length - 1][0]));
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    dispatch(setPeriod(value));
  };
  return (
    <div className="period-container">
      <select className="period-select" value={period} onChange={handleChange}>
        <option disabled={true}>--Select Period--</option>
        {options.map((option, index) => (
          <option key={option[0]} value={option[0]}>
            {option[1]}
          </option>
        ))}
      </select>
    </div>
  );
};
