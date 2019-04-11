import React from 'react';
import { Form, Button, Alert, InputGroup, Card, } from 'react-bootstrap';
import Blockies from 'react-blockies';
import ColorAddressInput from '../color-address-input';
import PropTypes from 'prop-types';
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
            receipt: null,
            error: null
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
        this.setState({ receipt: null })
    }

    async handleClick(e) {
        e.preventDefault();
        let target = e.target;
        const { input } = this.state;

        this.setState({ error: null, receipt: null });

        try {
            target.disabled = true;
            const toSend = this.props.MultiSigWallet.methods.addOwner(input.owner);

            const MsSend = this.props.MultiSigWallet.methods.submitTransaction(
                this.props.MultiSigWallet._address, 0, toSend.encodeABI()
            )
            const estimatedGas = await MsSend.estimateGas({ from: this.props.account });

            const receipt = await MsSend.send({
                from: this.props.account,
                gasLimit: estimatedGas
            });

            this.setState({ receipt });

            if (receipt.events.OwnerAddition) {
                this.props.onAddition(receipt.events.OwnerAddition.returnValues.owner)
            } else {
                this.props.onConfirmationRequired(receipt.events.Submission.returnValues.transactionId)
            }
        } catch (err) {
            console.error(err);
            this.setState({ error: err.message });
        } finally {
            target.disabled = null;
        }
    }

    render() {
        const { input, error, receipt } = this.state;

        return <Card>
            <Card.Header>
                <ColorAddressInput
                    defaultValue={input.owner}
                    onChange={(address) => this.handleNewOwner(address)}
                    placeholder="new owner (address)"
                /></Card.Header>
            <Card.Body className="text-right">
                {receipt ?
                    <Alert
                        dismissible={true}
                        onClose={() => { this.clearReceipt() }}
                        variant={isSuccess(receipt.status) ? 'success' : 'danger'} >
                        {isSuccess(receipt.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {receipt.transactionHash}
                    </Alert>
                    :
                    <Button type="submit" size="sm" variant="primary" onClick={(e) => this.handleClick(e)}>
                        <svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
                        </svg>
                        Add
                        </Button>}
            </Card.Body>

            {error != null && <Card.Footer><Alert variant="danger">{error}</Alert></Card.Footer>}

        </Card>;
    }
}

export default MSWAddOwner;