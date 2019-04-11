import React from 'react';
import { Alert, Card } from 'react-bootstrap';
import ColorAddressInput from '../color-address-input';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../transaction-submit-button';
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
            <Card.Header>
                <ColorAddressInput
                    defaultValue={input.owner}
                    onChange={(address) => this.handleNewOwner(address)}
                    placeholder="new owner (address)"
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
                            <svg className="svg-icon" viewBox="0 0 20 20">
                                <path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
                            </svg>
                        }
                        text={('Add')}
                        />}
            </Card.Body>
            {error != null && <Card.Footer><Alert variant="danger">{error.message}</Alert></Card.Footer>}

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