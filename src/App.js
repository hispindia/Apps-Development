import React, { useState } from 'react'
import { BrowserRouter } from "react-router-dom";
import './App.css'
import i18n from '@dhis2/d2-i18n'
import 'bootstrap/dist/css/bootstrap.css';
import Main from './components/mainComponent/mainComponent';
// import { configStore } from './Redux/store'
import { Provider } from 'react-redux'
import { from } from 'rxjs';
// const store = configStore();
const MyApp = () => { 
    return <> 
     {/* <Provider store ={store}> */}
       <BrowserRouter>
        <Main />
      </BrowserRouter>
      {/* </Provider> */}
    </>   
}
export default MyApp
