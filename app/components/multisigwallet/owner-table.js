import React from 'react';
import { Table, Button, Alert, Card, CardColumns } from 'react-bootstrap';
import MSWAddOwner from './owner-add';
import ColorEthAddress from '../color-eth-address';
import PropTypes from 'prop-types';

class MSWOwnerTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            owners: [],
            error: null
        }
    }

    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        account: PropTypes.string.isRequired,
        isOwner: PropTypes.bool,
        onConfirmationRequired: PropTypes.func
    }

    static defaultProps = {
        isOwner: false,
        onConfirmationRequired: ()=>{}
    }

    componentDidMount() {
        this.props.MultiSigWallet && this.props.MultiSigWallet.methods.getOwners().call().then((owners) => {
            this.setState({ owners: owners });
        })
    }

    async removeOwner(e, account) {
        e.preventDefault();
        let target = e.target;

        this.setState({ error: null, receipt: null });

        try {
            target.disabled = true;
            const toSend = this.props.MultiSigWallet.methods.removeOwner(account);
            const MsSend = this.props.MultiSigWallet.methods.submitTransaction(
                this.props.MultiSigWallet._address, 0, toSend.encodeABI()
            )
            const estimatedGas = await MsSend.estimateGas({ from: this.props.account });

            const receipt = await MsSend.send({
                from: this.props.account,
                gasLimit: estimatedGas
            });
            if (receipt.events.OwnerRemoval) {
                this.unlistOwner(receipt.events.OwnerRemoval.returnValues.owner)
            } else {
                this.props.onConfirmationRequired(receipt.events.Submission.returnValues.transactionId)
            }
            this.setState({ receipt });


        } catch (err) {
            console.error(err);
            this.setState({ error: err.message });
        } finally {
            target.disabled = null;
        }
    }

    listOwner(newOwner) {
        const owners = this.state.owners;
        owners.push(newOwner);
        this.setState({ owners });
    }

    unlistOwner(owner) {
        const owners = this.state.owners;
        var index = owners.indexOf(owner);
        if (index > -1) {
            owners.splice(index, 1);
        }
        this.setState({ owners });
    }
    render() {

        const owners = this.state.owners.map((address, index) => (
            <Card className="owner-item" key={index}>
                <Card.Header className="text-right">
                    <ColorEthAddress address={address} />
                </Card.Header>

                {this.props.isOwner && (<Card.Body className="text-right">
                    <Button
                        onClick={(e) => this.removeOwner(e, address)}
                        variant="danger"
                        type="submit"
                        size="sm">
                        <svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M14.776,10c0,0.239-0.195,0.434-0.435,0.434H5.658c-0.239,0-0.434-0.195-0.434-0.434s0.195-0.434,0.434-0.434h8.684C14.581,9.566,14.776,9.762,14.776,10 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.691-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.382,10c0-4.071-3.312-7.381-7.382-7.381C5.929,2.619,2.619,5.93,2.619,10c0,4.07,3.311,7.382,7.381,7.382C14.07,17.383,17.382,14.07,17.382,10"></path>
                        </svg>
                        Remove
                        </Button>
                </Card.Body>)}
            </Card>)
        )

        return (
            <CardColumns>
                {this.props.isOwner && <MSWAddOwner onAddition={(newOwner) => { this.listOwner(newOwner) }} MultiSigWallet={this.props.MultiSigWallet} account={this.props.account} />}
                <div className="owners-list">
                    {this.state.error != null && <Alert onClose={() => { }} variant="danger">{this.state.error}</Alert>}
                    {owners}
                </div>
            </CardColumns>
        )

    }
}

export default MSWOwnerTable;