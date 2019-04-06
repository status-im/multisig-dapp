import React from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import MSWAddOwner from './owner-add';
import Blockies from 'react-blockies';

class MSWOwnerTable extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        control: props.control,
        account: props.account,
        mswInstance: props.instance,
        owners: [],
        error: null
      }   
    }  
    
    componentDidMount() {
        this.state.mswInstance.methods.getOwners().call().then((owners) => {
            this.setState({owners:owners});
        })
    }

    async removeOwner(e, account){
        e.preventDefault();
        let target = e.target;

        this.setState({error: null, receipt: null});

        try {
            target.disabled = true;
            const toSend = this.state.mswInstance.methods.removeOwner(account);
            const MsSend = this.state.mswInstance.methods.submitTransaction(
                this.state.mswInstance._address, 0, toSend.encodeABI()
            )
            const estimatedGas = await MsSend.estimateGas({from: this.state.account});

            const receipt = await MsSend.send({
                from: this.state.account,
                gasLimit: estimatedGas
            });

            this.setState({receipt});


        } catch(err) {
            console.error(err);
            this.setState({error: err.message});
        } finally {
            target.disabled = null;
        }
    }
    
    render() {

        const owners = this.state.owners.map((address, index) => (
            <tr key={index}>
                <td><Blockies seed={address.toLowerCase()} size={8} scale={3}/></td>
                <td>{address}</td>
                <td><Button bsStyle="danger" disabled={!this.state.control} type="submit" onClick={(e) => this.removeOwner(e, address)}>Remove</Button></td>
            </tr>)
        )

        return (
            <React.Fragment>
                {this.state.control && <MSWAddOwner instance={this.state.mswInstance} account={this.state.account} />}
                    <div>
                    { this.state.error != null && <Alert onDismiss={()=>{}} bsStyle="danger">{this.state.error}</Alert> }
                    <Table size="sm" responsive={true} striped bordered hover >
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Owner</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners}
                        </tbody>
                    </Table>
                    
                </div>
            </React.Fragment>
        )

    }
}

export default MSWOwnerTable;