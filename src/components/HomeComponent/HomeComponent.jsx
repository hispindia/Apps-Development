import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../Navbar/NavBar';
import '../../App.css';

export class HomeComponent extends Component {
    static propTypes = {

    }

    render() {
        return (
            <div id='mainPage'>
                <h2> Home </h2>
                {/* <StandardReport></StandardReport> */}
            </div>
        )
    }
}

export default HomeComponent
