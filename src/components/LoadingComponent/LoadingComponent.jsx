import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
class Alert extends Component {
    constructor(props) {
        super(props)
        this.state = {  }
    }
    hideAlert(){
        //this.props.history.goBack();
        window.history.back();
     }
    render() { 
     //console.log("here is props", this.props)
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