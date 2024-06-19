import React, { useState, useEffect } from "react";

import EpiCard from "./EpiCard";
import { printContent } from "../utils";
import { useLocation } from "react-router-dom";
import { ApiService } from "../services/api";

import EmblemOfYemen from '../images/Emblem_of_Yemen.png'

const MyApp = () => {
  const { search } = useLocation();

  const [uid, setUid] = useState("");
  const [display, setDisplay] = useState(false);
  const [orgUnits, setOrgUnits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const orgUnits = {};
      let resOrgUnits = await ApiService.organisationUnits.get();
      resOrgUnits.organisationUnits.forEach((orgUnit) => {
        orgUnits[orgUnit.id] = {
          name: orgUnit.name,
          path: orgUnit.path,
        };
      });
      setOrgUnits(orgUnits);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (search && orgUnits) {
      const uid = new URLSearchParams(search).get("id");
      if (uid) {
        setUid(uid);
        setDisplay(true);
      }
    }
  }, [search, orgUnits]);

  if (loading) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center" >
        <div className="spinner-border text-primary">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="h2 mt-3 text-center text-decoration-underline">EPI Vaccination Card</p>
      </div>
      <div className="p-3 text-end">
      <div className="row my-3">
        <div className="col-3">
          <input
            type="text"
            className="form-control"
            value={uid}
            onChange={(e) => {
              setUid(e.target.value);
              setDisplay(false);
            }}
            placeholder="Please Enter EPI UID"
          />
        </div>
        <div className="col-auto">
          <button class="btn btn-primary" onClick={() => setDisplay(true)}>
            Generate
          </button>
        </div>
        {display && (
          <div className="col text-end">
            <button
              className="btn btn-success"
              onClick={() => printContent("#print")}
            >
              Print
            </button>
          </div>
        )}
      </div>

      {display && <EpiCard orgUnits={orgUnits} uid={uid} />}
    </div>
    </div>
    
  );
};
export default MyApp;
