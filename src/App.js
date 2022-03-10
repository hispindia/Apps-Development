import React, { useState } from 'react'
import './App.css'
import i18n from '@dhis2/d2-i18n'
import 'bootstrap/dist/css/bootstrap.css';
import DynamicComponent from './components/dynamicComponent/dynamicComponent';
const MyApp = () => { 
    return <> 
      <DynamicComponent />
    </>   
}
export default MyApp
