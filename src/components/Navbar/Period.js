import React, { useState, useEffect } from "react";
import { setPeriod } from "../../store/navbar/navbar.action";
import { useDispatch, useSelector } from "react-redux";

export const Period = () => {
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const period = useSelector(state => state.navbar.period)
    const [years, setYears] = useState([]);

    useEffect(() => {
        const base = 2022;
        const years = [];
        for(let i = base; i <=currentYear; i++) years.push(i);
        setYears(years);
    }, [currentYear])

    const handleChange = (ev) => {
        const {value} = ev.target;
        if(value) {
          dispatch(setPeriod(value));
        }
    }

  return (
    <div className="period-container">
      <select className="form-select" value={period} onChange={handleChange}>
        <option disabled={true}>--Select Period--</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
