import React, { Component } from 'react';
import onSelect from '../homeComponent/homeComponent'
class DynamicComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded">
                <h2 className="ml-5">Tracker Aggregation </h2>
                <div className="row">
                     <div className="col-sm-2 m-1 ml-5"> Org Unit:</div>
                     <div className="col-sm-4 m-1"> <input className="form-control" value={this.props.data.displayName} /></div>
                </div>
                <div className="row">
                    <div className="col-sm-2 m-1 ml-5 ">
                        Start Date:
                      </div>
                    <div className="col-sm-4 m-1">
                       <input type="date" className="form-control" />
                   </div>
                </div>
                <div className="row">
                    <div className="col-sm-2 m-1 ml-5 ">
                        End Date
                   </div>
                    <div className="col-sm-4 m-1">
                      <input type="date" className="form-control" />
                   </div>
                </div>
                <button className="btn btn-primary ml-5">Submit</button>
            </div>
        );
    }
}
export default DynamicComponent;