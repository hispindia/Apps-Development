import React from "react";
import "./styles.scss";

import IndicatorScore from "../IndicatorScore";
import { Funds } from "../Funds/Funds";
import { Scores, ScoreChart } from "../Scores";
import { useSelector } from "react-redux";

const Main = () => {
  const selectedGroup = useSelector((state) => state.navbar.selectedGroup);
  return (
    <div id='downloads'>
    <a id="dlink" style={{display:"none"}}></a>
      <Funds />
      { (selectedGroup && selectedGroup == "ALL IPA Units") ? <ScoreChart /> : <Scores />}
      { selectedGroup != "ALL IPA Units" && <IndicatorScore />}
    </div>
  );
};

export default Main;
