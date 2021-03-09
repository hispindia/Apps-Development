import React,{Component, useState} from 'react';
import { Link  } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
return (
    <>
      <nav className="leftbar">
        <div >
        <div>
          </div>
          <ul>

            <li>
              <Link to='/'>
                Home
              </Link>
            </li>

            <li>
              <Link
                to='/report-configuration'>
                Report Configuration
              </Link>
            </li>
            <li>
              <Link
                to='/section-management'>
                Section Management 
              </Link>
            </li>

            <li>
              <Link
                to='/report-management'>
                Report Management
              </Link>
            </li>

            <li>
              <Link
                to='/report-genration'>
                Report Generation
              </Link>
            </li>


            <li>
              <Link
                to='/data-status'>
                Data Status
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
