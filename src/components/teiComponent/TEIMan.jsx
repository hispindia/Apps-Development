import React, { PureComponent } from 'react';
import ShowTEI from './ShowTEI'
import { BaseUrl } from '../../services/EventService'
import { ApiService } from '../../services/apiService';
import { PlayloadService } from '../../services/dataService'

class TEIMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: '',
            tei: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.subscription = PlayloadService.getPlayload().subscribe(payload => {
            console.log("here is playload", playload)
            let data = {
                program: payload.playload.programId,
                ou: payload.playload.orgUnitId
            }
            ApiService.getTrackedEntityInstance(data).then(
                (response) => {
                    var arr = [];
                    response.trackedEntityInstances.forEach(tei => {
                        let obj = {
                            tei: "",
                            Name: "",
                            Gender: "",
                            checked: false
                        };
                        obj["Project Donor"] = ""
                        obj["tei"] = tei.trackedEntityInstance
                        var neededAttr = [];
                        neededAttr["N48JExn2s73"] = true; //Gender
                        neededAttr["KLSVjftH2xS"] = true; //Project Donor
                        neededAttr["L2doMQ7OtUB"] = true; //Beneficiary ID
                        neededAttr["gJ7mFiFa0dU"] = true; //first Name
                        neededAttr["t67rLuGIQmZ"] = true; //Last Name
                        tei.attributes.forEach(attr => {
                            if (neededAttr[attr.attribute]) obj[attr.displayName] = attr.value;
    
                        })
                        obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");
                        arr.push(obj);
    
                    })
                    this.setState({ tei: arr })
                    // console.log(this.state)
                },
                (error) => {
                    console.log("here is seleted", error);
                }
            )
        });
        
        // ApiService.getTrackedEntityInstance(data).then(
        //     (response) => {
        //         var arr = [];
        //         response.trackedEntityInstances.forEach(tei => {
        //             let obj = {
        //                 tei: "",
        //                 Name: "",
        //                 Gender: "",
        //                 checked: false
        //             };
        //             obj["Project Donor"] = ""
        //             obj["tei"] = tei.trackedEntityInstance
        //             var neededAttr = [];
        //             neededAttr["N48JExn2s73"] = true; //Gender
        //             neededAttr["KLSVjftH2xS"] = true; //Project Donor
        //             neededAttr["L2doMQ7OtUB"] = true; //Beneficiary ID
        //             neededAttr["gJ7mFiFa0dU"] = true; //first Name
        //             neededAttr["t67rLuGIQmZ"] = true; //Last Name
        //             tei.attributes.forEach(attr => {
        //                 if (neededAttr[attr.attribute]) obj[attr.displayName] = attr.value;

        //             })
        //             obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");
        //             arr.push(obj);

        //         })
        //         this.setState({ tei: arr })
        //         // console.log(this.state)
        //     },
        //     (error) => {
        //         console.log("here is seleted", error);
        //     }
        // )
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
    }
    render() {
        // console.log("here is props at main file", this.props)
        return (<>
            <ShowTEI teis={this.state.tei} />
        </>
        );
    }
}
export default TEIMain;