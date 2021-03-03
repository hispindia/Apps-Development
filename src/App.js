import React from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import store from './redux/store/store'
import { Provider } from 'react-redux'
import OrgUnit from './components/orgUnit'
const MyApp = () => (
    <Provider store ={store}>
        <OrgUnit />
    </Provider>
)
export default MyApp
