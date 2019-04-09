import React from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import MSWAddOwner from './owner-add';
import ColorEthAddress from '../color-eth-address';

class MSWOwnerTable extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        owners: [],
        error: null
      }   
    }  
    
    componentDidMount() {
        this.props.MultiSigWallet && this.props.MultiSigWallet.methods.getOwners().call().then((owners) => {
            this.setState({owners:owners});
        })
    }

    async removeOwner(e, account){
        e.preventDefault();
        let target = e.target;

        this.setState({error: null, receipt: null});

        try {
            target.disabled = true;
            const toSend = this.props.MultiSigWallet.methods.removeOwner(account);
            const MsSend = this.props.MultiSigWallet.methods.submitTransaction(
                this.props.MultiSigWallet._address, 0, toSend.encodeABI()
            )
            const estimatedGas = await MsSend.estimateGas({from: this.props.account});

            const receipt = await MsSend.send({
                from: this.props.account,
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
                <td><ColorEthAddress address={address}/></td>
                <td><Button variant="danger" disabled={!this.props.isOwner} type="submit" onClick={(e) => this.removeOwner(e, address)}>Remove</Button></td>
            </tr>)
        )

        return (
            <React.Fragment>
                {this.props.isOwner && <MSWAddOwner MultiSigWallet={this.props.MultiSigWallet} account={this.props.account} />}
                    <div>
                    { this.state.error != null && <Alert onClose={()=>{}} variant="danger">{this.state.error}</Alert> }
                    <Table size="sm" responsive={true} striped bordered hover >
                        <thead>
                            <tr>
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