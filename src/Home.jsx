import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table, TableBody, TableRow, TableCell, Button } from "@dhis2/ui-core";
import ReactPaginate from "react-js-pagination";
import { CircularProgress } from "@material-ui/core";

import "./Pagination.css"; // Custom CSS file for pagination

const Home = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedProgramValue, setSelectedProgramValue] = useState("");
  const [Data, setData] = useState([]);
  const [my, setMy] = useState("");
  const defaultSelectedProgramValue = options.length > 0 ? options[0].id : "";
  const [isLoading, setIsLoading] = useState(false);
  const [program, setProgram] = useState([]);

  useEffect(() => {
    fetch(
      "https://amr.hispindia.org/varanasi_test/api/programs.json?fields=id,name&paging=false"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setOptions(data.programs); // Update this line if the structure is different
      })
      .catch((error) => console.error("Error fetching data from API: ", error));
  }, []);

  useEffect(() => {
    const dateEnd = new Date(selectedEndDate);
    const dateStart = new Date(selectedStartDate);
    const formattedStartDate = `${dateStart.getFullYear()}-${
      dateStart.getMonth() + 1
    }-${dateStart.getDate()}`;
    const formattedEndDate = `${dateEnd.getFullYear()}-${
      dateEnd.getMonth() + 1
    }-${dateEnd.getDate()}`;
    setIsLoading(true);
    fetch(
      `https://amr.hispindia.org/varanasi_test/api/events.json?skipPaging=true%20&%20startDate=${formattedStartDate}&endDate=${formattedEndDate}&program=${
        selectedProgramValue || defaultSelectedProgramValue
      }&ou=ANGhR1pa8I5`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data.events);
        setMy(data);
        setIsLoading(false);
      });
  }, [
    selectedProgramValue,
    selectedEndDate,
    selectedStartDate,
    defaultSelectedProgramValue,
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value to set the number of items per page

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const val = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = Data.slice(indexOfFirstItem, indexOfLastItem);
    if (currentData != undefined) {
      const v = currentData.map((ele, index) => {
        if (ele.program) {
          var proId = ele.program;
          var name = [],
            dataValue = [],
            data = [],
            date = [];
          date["value"] = ele.eventDate.substring(0, 10);
          for (let program of options) {
            if (program.id == proId) {
              name["value"] = program.name;
            }
          }
          for (let value of ele.dataValues) {
            dataValue["0"] = name;
            if (value.dataElement == "B7XuDaXPv10") {
              dataValue["1"] = value;
            }
            if (value.dataElement == "GpAu5HjWAEz") {
              dataValue["2"] = value;
            }
            if (value.dataElement == "mp5MeJ2dFQz") {
              dataValue["3"] = value;
            }
            if (
              value.dataElement == "SaQe2REkGVw" ||
              value.dataElement == "u8VDCIwa3w4"
            ) {
              dataValue["4"] = value;
            }
            dataValue["5"] = date;
          }
          if (!dataValue["1"]) {
            let data = [{ value: "" }];
            dataValue["1"] = data;
          }
          if (!dataValue["2"]) {
            let data = [{ value: "" }];
            dataValue["2"] = data;
          }
          if (!dataValue["3"]) {
            let data = [{ value: "" }];
            dataValue["3"] = data;
          }
          if (!dataValue["4"]) {
            let data = [{ value: "" }];
            dataValue["4"] = data;
          }
          if (dataValue["4"].value !== "Organism growth detected") {
            data = dataValue;
          }
          return (
            <>
              {data.length ? (
                <TableRow>
                  {data.map((ele) => (
                    <TableCell>{ele.value}</TableCell>
                  ))}
                </TableRow>
              ) : (
                ""
              )}
            </>
          );
        }
      });
      return v;
    }
  };

  const handleSelectChange = (e) => {
    setSelectedProgramValue(e.target.value);
  };

  console.log("option", options);

  return (
    <>
      <div style={{ padding: "10px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ margin: 50 }}>
            <span>StartDate</span>
            <DatePicker
              selected={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div style={{ margin: 50 }}>
            <span>EndDate</span>
            <DatePicker
              selected={selectedEndDate}
              onChange={(date) => setSelectedEndDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div style={{ marginTop: "50px" }}>
            {options.length > 0 && (
              <select
                value={selectedProgramValue || defaultSelectedProgramValue}
                onChange={handleSelectChange}
              >
                <option value={options[0].id}>{options[0].name}</option>
                {options.slice(1).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div style={{ marginTop: "42px", marginLeft: "5px" }}>
            <Button primary={true}>Aggregate</Button>
          </div>
        </div>
        <div>
          <Table>
            <TableRow>
              <TableCell>
                <b>Program Name</b>
              </TableCell>
              <TableCell>
                <b>Location</b>
              </TableCell>
              <TableCell>
                <b>Lab Sample ID</b>
              </TableCell>
              <TableCell>
                <b>Sample Type</b>
              </TableCell>
              <TableCell>
                <b>Organism</b>
              </TableCell>
              <TableCell>
                <b>Event Date</b>
              </TableCell>
            </TableRow>
            {isLoading ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <TableBody>{val()}</TableBody>
            )}
          </Table>

          
              <ReactPaginate
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={Data.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
              />
            
        </div>
      </div>
    </>
  );
};

export default Home;
