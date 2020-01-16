import React, { Component } from 'react';
import onSelect from '../homeComponent/homeComponent'
class DynamicComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        }
        // this.onSelect = this.onSelect.bind(this)
    }
    render() { 
        console.log("here is props", this.props)
        return ( 
            <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded"> 
                <h2>Welcome to dynamic component for display  data </h2>
                <h4>Here is selected org unit details</h4>
                <div>Org Unit:  {this.props.data.id}</div>
                <div>Org Name:  {this.props.data.displayName}</div>
                <div>Org path:  {this.props.data.path}</div>
                
            </div>
         );
    }
}
export default DynamicComponent;