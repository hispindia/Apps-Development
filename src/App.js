import React from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import store from './redux/store/store'
import { Provider } from 'react-redux'
import TEIView from './components/TEIView'
const MyApp = () => (
    <Provider store ={store}>
        <TEIView />
    </Provider>
)
export default MyApp
