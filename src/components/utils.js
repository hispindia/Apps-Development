//Year starts from 2022
export const getYears = (selectedPeriod) => {
  const period = [];
  for(let i=2022; i<=selectedPeriod;i++) period.push(i);
  return period;
}

//Get last 5  quarters
export const getQuarters = (selectedPeriod) => {
  const periods = [];
  const quarter = ["Q1", "Q2", "Q3", "Q4"];
  const present = new Date();
  const presentYear = present.getFullYear();
  if (presentYear == selectedPeriod) {
    let presentMonth = present.getMonth();
    if (presentMonth >= 0 && presentMonth <= 2) {
      periods.push(`${selectedPeriod - 2}Q4`)
      quarter.forEach((q) => periods.push(`${selectedPeriod - 1}${q}`));
    }
    else if (presentMonth >= 3 && presentMonth <= 5) {
      let prevPe = []
      quarter.forEach((q, id) => {
        if (id >= 1) prevPe.push(`${selectedPeriod - 1}${q}`);
        else periods.push(`${selectedPeriod}${q}`);
      });
      periods.unshift(...prevPe);
      periods.unshift(`${selectedPeriod - 1}Q1`);
    }
    else if (presentMonth >= 6 && presentMonth <= 8) {
      let prevPe = []
      quarter.forEach((q, id) => {
        if (id >= 2) prevPe.push(`${selectedPeriod - 1}${q}`);
        else periods.push(`${selectedPeriod}${q}`);
      });
      periods.unshift(...prevPe);
      periods.unshift(`${selectedPeriod - 1}Q2`);
    }
    else if (presentMonth >= 9 && presentMonth <= 11) {
      let prevPe = []
      quarter.forEach((q, id) => {
        if (id >= 3) prevPe.push(`${selectedPeriod - 1}${q}`);
        else periods.push(`${selectedPeriod}${q}`);
      });
      periods.unshift(...prevPe);
      periods.unshift(`${selectedPeriod - 1}Q3`);
    }
  } else {
    periods.push(`${selectedPeriod - 1}Q4`)
    quarter.forEach((q) => periods.push(`${selectedPeriod}${q}`));
  }
  return periods;
};
