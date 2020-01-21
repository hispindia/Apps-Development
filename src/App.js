import React, { useState } from 'react'
import { BrowserRouter } from "react-router-dom";
import './App.css'
import i18n from '@dhis2/d2-i18n'
import 'bootstrap/dist/css/bootstrap.css';
import Main from './components/mainComponent/mainComponent';

const MyApp = () => { 
    return <> 
       <BrowserRouter>
        <Main />
      </BrowserRouter>
    </>   
}
export default MyApp
