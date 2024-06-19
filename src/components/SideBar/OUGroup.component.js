import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroup } from "../../store/outree/outree.action";

export const OUGroup = () => {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.outree.groups)

    const handleChange = (ev) => {
        const {value} = ev.target;
        if(value) {
          dispatch(setSelectedGroup(value));
        }
    }

  return (
    <div className="group-container">
      <select className="form-select" onChange={handleChange}>
        <option val="">--Select Facility Groups--</option>
        {groups.map(group => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
    </div>
  );
};
