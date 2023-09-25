import React from "react";
import { arrayOf, number, object, string } from "prop-types";
import { Grid } from "@material-ui/core";
import { DataElement } from "./DataElement";
import { ChildSection } from "./ChildSection";

export const SectionContent = ({
  dataElements,
  half,
  childHalf,
  childSections,
  firstHalf,
  secondHalf,
  combinedSections,
  renderType,
}) => {
  const getChildSection = (childSection) => (
    <ChildSection key={childSection.id} childSection={childSection} />
  );

  if (dataElements.length > 0) {
    if (renderType === "MATRIX")
      return (
        <Grid container spacing={0}>
          {dataElements.map((id) => (
            <Grid item key={id}>
              <DataElement key={id} id={id} />
            </Grid>
          ))}
        </Grid>
      );
    else
      return (
        <Grid container spacing={0}>
          <Grid item xs>
            {dataElements.slice(0, half).map((id) => (
              <DataElement key={id} id={id} />
            ))}
          </Grid>
          <Grid item xs>
            {dataElements.slice(half).map((id) => (
              <DataElement key={id} id={id} />
            ))}
            {childSections &&
              childSections.map((childSection) =>
                getChildSection(childSection)
              )}
          </Grid>
        </Grid>
      );
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: "1" }}>
        {firstHalf &&
          firstHalf.slice(0, 1).map((firstHalf) => getChildSection(firstHalf))}
      </div>
      <div style={{ flex: "1" }}>
        {childSections &&
          childSections
            .slice(2, 3)
            .map((childSections) => getChildSection(childSections))}
      </div>
      <div
        style={{
          flex: "2",
        }}
      >
        {firstHalf &&
          firstHalf.slice(1, 2).map((firstHalf) => getChildSection(firstHalf))}
      </div>
    </div>

    // <Grid container spacing={0}>
    //     <Grid item xs={4}>
    //         {childSections &&
    //             childSections
    //             .slice(0,1)
    //                 .map(childSections => getChildSection(childSections))}
    //                 <h1>ssssssssssssssssssssssssss</h1>

    //     </Grid>

    //     <Grid item xs={4}>
    //         {childSections &&
    //             childSections
    //             .slice(2,3)
    //                 .map(childSections => getChildSection(childSections))}
    //                 <h1>3456789</h1>

    //     </Grid>
    //     <Grid item xs={4}>
    //         {childSections &&
    //             childSections
    //             .slice(1,2)
    //                 .map(childSections => getChildSection(childSections))}
    //                 <h1>rrrr</h1>

    //     </Grid>

    //     {/* <Grid item xs>
    //         {childSections &&
    //             childSections
    //                 .slice(firstHalf)
    //                 .map(childSection => getChildSection(childSection))}
    //                 <h1>ffffffffffffffffff</h1>
    //     </Grid> */}
    //     {/* <Grid item xs>
    //         {childSections &&
    //             childSections
    //                 .slice(secondHalf)
    //                 .map(childSection => getChildSection(childSection))}
    //                 <h1>11111111111</h1>
    //     </Grid> */}

    // </Grid>====using childsection only

    //     <Grid container spacing={0}>
    //     <Grid item xs>
    //         {childSections &&
    //             childSections
    //                 .slice(0, childHalf)
    //                 .map(childSection => getChildSection(childSection))}
    //     </Grid>
    //     <Grid item xs>
    //         {childSections &&
    //             childSections
    //                 .slice(0, childHalf)
    //                 .map(childSection => getChildSection(childSection))}
    //     </Grid>
    //     <Grid item xs>
    //         {childSections &&
    //             childSections
    //                 .slice(childHalf)
    //                 .map(childSection => getChildSection(childSection))}
    //     </Grid>
    // </Grid>//original code
  );
};

SectionContent.propTypes = {
  dataElements: arrayOf(string).isRequired,
  half: number.isRequired,
  childHalf: number.isRequired,
  childSections: arrayOf(object).isRequired,
  renderType: string.isRequired,
};
