import React from 'react';
import { Alert, Card } from 'react-bootstrap';
import EthAddress from '../EthAddress';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../TransactionSubmitButton';
import IconAdd from '../icon/Add';

function isSuccess(status) {
    return status === "0x1" || status === true;
}
class MSWAddOwner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {
                owner: '0x0000000000000000000000000000000000000000'
            },
            result: null,
            error: null,
            txHash: null,
            txWaiting: false
        };
    }
    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        account: PropTypes.string.isRequired,
        onAddition: PropTypes.func,
        onConfirmationRequired: PropTypes.func
    };

    static defaultProps = {
        onAddition: () => { },
        onConfirmationRequired: () => { }
    };
    handleChangeFile(e) {
        const { input } = this.state;
        input.file = [e.target];
        this.setState({ input });
    }

    handleChange(e, name) {
        const { input } = this.state;
        input[name] = e.target.value;
        this.setState({ input });
    }

    handleNewOwner(address) {
        const { input } = this.state;
        if(!address) {
            address = "0x0000000000000000000000000000000000000000";
        }
        input.owner = address;
        this.setState({ input });
    }

    handleCheckbox(e, name) {
        const { input } = this.state;
        input[name] = e.target.checked;
        this.setState({ input });
    }

    clearReceipt() {
        this.setState({ result: null })
    }
    
    handleResult(result) {
        this.setState({ result });
        if (result.events.OwnerAddition) {
            this.props.onAddition(result.events.OwnerAddition.returnValues.owner)
        } else {
            this.props.onConfirmationRequired(result.events.Submission.returnValues.transactionId)
        }
    }

    handleError(error) {
        this.setState({ error });
    }

    handleSubmission(txHash) {
        this.setState({ txHash });
    }

    render() {
        const { input, error, result } = this.state;
        const { MultiSigWallet, account } = this.props;
        return <Card>
            <Card.Header className="text-center">
                <EthAddress
                    control={true}
                    value={input.owner}
                    allowZero={false}
                    onChange={(address) => this.handleNewOwner(address)}
                /></Card.Header>
            <Card.Body className="text-right">
                {result ?
                    <Alert
                        dismissible={true}
                        onClose={() => { this.clearReceipt() }}
                        variant={isSuccess(result.status) ? 'success' : 'danger'} >
                        {isSuccess(result.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {result.transactionHash}
                    </Alert>
                    :
                    <TransactionSubmitButton 
                        account={account}
                        disabled={input.owner=="0x0000000000000000000000000000000000000000"}
                        sendTransaction={
                            MultiSigWallet.methods.submitTransaction(
                                MultiSigWallet._address, 
                                0, 
                                MultiSigWallet.methods.addOwner(input.owner).encodeABI()
                            )
                        }
                        onSubmission={(txHash) => this.handleSubmission(txHash) }
                        onResult={(result) => this.handleResult(result) }
                        onError={(error) => this.handleError(error) }
                        icon={
                            <IconAdd/>
                        }
                        text={('Add')}
                        />}
            </Card.Body>
            {error != null && <Card.Footer><Alert dismissible onClose={()=>this.setState({error:null})} variant="danger">{error.message}</Alert></Card.Footer>}

        </Card>;
    }
}
/***
 * 
 * <Button type="submit" size="sm" variant="primary" onClick={(e) => this.handleClick(e)}>
                        
                        Add
                        </Button>
 */
export default MSWAddOwner;