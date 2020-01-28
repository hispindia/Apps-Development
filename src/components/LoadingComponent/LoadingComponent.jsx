import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
class Alert extends Component {
    state = {  }
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