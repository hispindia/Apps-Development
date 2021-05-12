import React from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import store from './redux/store/store'
import { Provider } from 'react-redux'
import Static from './components/static'
const MyApp = () => (
    <Provider store ={store}>
        <Static />
    </Provider>
)
export default MyApp
