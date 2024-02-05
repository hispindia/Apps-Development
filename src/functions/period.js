export const getYears = (selectedPeriod) => {
    const period = [];
    for(let i=2022; i<=selectedPeriod;i++) period.push(i);
    return period;
  }