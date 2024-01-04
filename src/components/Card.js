import React from "react";

const Card = ({ center }) => {
  return <div className="col g-2">
    <div className="card">
        <div className="card-header text-center fw-semibold" style={{background:`${center.color}`, color:`${center.color ?'white': 'black'}`}}>{center.name}</div>
        <div className="card-body text-center fw-semibold">{Number(center.value)}</div>
    </div>
  </div>
};
 
export default Card;
