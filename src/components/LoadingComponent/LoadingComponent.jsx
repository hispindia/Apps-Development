import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
class Alert extends Component {
    constructor(props) {
        super(props)
        this.state = {  }
    }
    hideAlert(){
        window.history.back();
     }
    render() { 
        return ( 
            <>
           <SweetAlert
            success
            title="OK"
            onConfirm={this.hideAlert}
            >
           Event Push Success!
            </SweetAlert>
            </>
         );
    }
}
 
export default Alert;