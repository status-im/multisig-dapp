import React from 'react';
import { Alert, Card, CardColumns } from 'react-bootstrap';
import MSWAddOwner from './owner-add';
import EthAddress from '../EthAddress';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../TransactionSubmitButton';
import IconRemove from '../icon/Remove'
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
        this.props.MultiSigWallet.methods.getOwners().call().then((owners) => {
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
        const { error, owners } = this.state;
        return (
            <CardColumns>
                {isOwner && <MSWAddOwner onAddition={(newOwner) => { this.listOwner(newOwner) }} MultiSigWallet={MultiSigWallet} account={account} />}
                <div className="owners-list">
                    {error != null && <Alert dismissible onClose={() => { this.setState({error: null}) }} variant="danger">{error}</Alert>}
                    { owners.map((address, index) => (
                        <Card className="owner-item" key={index}>
                            <Card.Header className="text-center">
                                <EthAddress blockyScale={4} value={address} />
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
                                        <IconRemove/>
                                    }
                                    text="Remove"
                                    variant="danger"
                                    />
                            </Card.Body>)}
                        </Card>)
                    )}
                </div>
            </CardColumns>
        )

    }
}

export default MSWOwnerTable;