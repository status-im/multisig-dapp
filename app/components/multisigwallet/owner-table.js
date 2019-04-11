import React from 'react';
import { Alert, Card, CardColumns } from 'react-bootstrap';
import MSWAddOwner from './owner-add';
import ColorEthAddress from '../color-eth-address';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../transaction-submit-button';

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

    handleResult(result) {
        this.setState({ result });
        if (result.events.OwnerRemoval) {
            this.unlistOwner(result.events.OwnerRemoval.returnValues.owner)
        } else {
            this.props.onConfirmationRequired(result.events.Submission.returnValues.transactionId)
        }
    }

    handleError(error) {
        this.setState({ error: error.message });
    }

    handleSubmission(txHash) {
        this.setState({ txHash });
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
        const { MultiSigWallet, account, isOwner } = this.props;
        const owners = this.state.owners.map((address, index) => (
            <Card className="owner-item" key={index}>
                <Card.Header className="text-right">
                    <ColorEthAddress address={address} />
                </Card.Header>
                {isOwner && (<Card.Body className="text-right">
                    <TransactionSubmitButton 
                        account={account}
                        sendTransaction={
                            MultiSigWallet.methods.submitTransaction(
                                MultiSigWallet._address,
                                0,
                                MultiSigWallet.methods.removeOwner(address).encodeABI()
                            )
                        }
                        onSubmission={(txHash) => this.handleSubmission(txHash) }
                        onResult={(result) => this.handleResult(result) }
                        onError={(error) => this.handleError(error) }
                        icon={
                            <svg className="svg-icon" viewBox="0 0 20 20">
                                <path d="M14.776,10c0,0.239-0.195,0.434-0.435,0.434H5.658c-0.239,0-0.434-0.195-0.434-0.434s0.195-0.434,0.434-0.434h8.684C14.581,9.566,14.776,9.762,14.776,10 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.691-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.382,10c0-4.071-3.312-7.381-7.382-7.381C5.929,2.619,2.619,5.93,2.619,10c0,4.07,3.311,7.382,7.381,7.382C14.07,17.383,17.382,14.07,17.382,10"></path>
                            </svg>
                        }
                        text="Remove"
                        variant="danger"
                        />
                </Card.Body>)}
            </Card>)
        )

        return (
            <CardColumns>
                {this.props.isOwner && <MSWAddOwner onAddition={(newOwner) => { this.listOwner(newOwner) }} MultiSigWallet={this.props.MultiSigWallet} account={this.props.account} />}
                <div className="owners-list">
                    {this.state.error != null && <Alert dismissible onClose={() => { this.setState({error: null}) }} variant="danger">{this.state.error}</Alert>}
                    {owners}
                </div>
            </CardColumns>
        )

    }
}

export default MSWOwnerTable;