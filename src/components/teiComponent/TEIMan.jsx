import React, { PureComponent } from 'react';
import ShowTEI from './ShowTEI'
import { ApiService } from '../../services/apiService';
import { payloadService } from '../../services/dataService';
class TEIMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: '',
        }
        // this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentWillMount() {
        var test;
        this.subscription = payloadService.getpayload().subscribe(payload => {
            test = payload
        });
        this.setState({payload: test.payload})
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
    }
    render() {
        return (<>
        
            <ShowTEI teis={this.state} />
        </>
        );
    }
}
export default TEIMain;