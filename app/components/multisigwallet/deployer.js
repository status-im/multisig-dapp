import React from 'react';
import MultiSigWallet from 'Embark/contracts/MultiSigWallet';
import { Alert, Form, Button } from 'react-bootstrap';

import EditableList from '../editable-list';

import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

class MSWDeployer extends React.Component {

    constructor(props) {
        super(props);
        this.onDeploy = this.onDeploy.bind(this);
        this.state = {
            strError: null,
            activeKey: 1,
            strError: null,
            owners: props.account ? [props.account] : [],
            required: 1
        };
    }


    onDeploy(MultiSigWallet) {
        this.props.onDeploy(MultiSigWallet);
    }

    onOwnersChange(list) {
        let owners = list.listItems.map((val) => {return val.text }).filter(val => {
            return val != null;
        })
        this.setState({ owners: owners });
    }

    setRequired(val) {
        console.log(val);
        this.setState({ required: val });
    }

    deployWallet(e) {
        e.preventDefault();
        if(this.state.required == 0) {
            return this.setState({ strError: "Required cannot be zero" });
        } else if (this.state.owners.length < this.state.required){
            return this.setState({ strError: "Required cannot be more then owners lenght" })
        } else {
            if(new Set(this.state.owners).size !== this.state.owners.length){   
                return this.setState({ strError: "Cannot have duplicate owners" })
            }
        }
        this.setState({ strError: null })
        try {
            let deployTx = MultiSigWallet.deploy({ arguments: [this.state.owners, this.state.required] });
            deployTx.estimateGas().then(
                (gas) => {
                    deployTx.send({from: this.props.account, gas: gas}).then(this.onDeploy).catch((error) => {
                        this.setState({ strError: "Error on deploy. " + error.message })
                    });
                }
            ).catch((error) => {
                this.setState({ strError: "Deploy would fail. " + error.message })
            });
        } catch(error) {
            this.setState({ strError: "Failed processing parameters: " + error.message })
        }
        
    }


    render() {
        return (
            <form>
                <h2>Deploy MultiSigWallet</h2>
                <Form.Group>
                    <Form.Label>Owners:</Form.Label>
                    <EditableList onChange={this.onOwnersChange.bind(this)} title="Owners" items={this.state.owners} itemPlaceholder="+" />
                    <Form.Label>Required:</Form.Label>
                    <div>{this.state.required} of {this.state.owners.length}
                        <Slider dots={true} min={0} max={this.state.owners.length} step={1} defaultValue={this.state.required} onChange={this.setRequired.bind(this)} />
                    </div>
                    <Button size="lg" type="submit" variant="primary" onClick={(e) => this.deployWallet(e)}>Deploy</Button>
                </Form.Group>
                {this.state.strError != null && <Alert onClose={() => {this.setState({strError: null})}} variant="danger">{this.state.strError}</Alert>}
            </form>);
    }
}

export default MSWDeployer;
