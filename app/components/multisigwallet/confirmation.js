import React from 'react';
import { Button } from 'react-bootstrap';

class MSWConfirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountConfirmed: false,
            confirmations: 0,
            required: 0
        };
    }

    componentDidMount() {
        this.props.MultiSigWallet.methods.required().call().then((required) => {
            this.setState({ required: required });
        })
        this.props.MultiSigWallet.methods.getConfirmationCount(this.props.id).call().then((confirmations) => {
            this.setState({ confirmations: confirmations });
        })
        if (this.props.isOwner) {
            this.props.MultiSigWallet.methods.confirmations(this.props.id, this.props.account).call().then((accountConfirmed) => {
                this.setState({ accountConfirmed: accountConfirmed });
            })
        }

    }

    async handleClick(e) {
        e.preventDefault();
        let target = e.target;
        const { transactionId, value } = this.state;

        this.setState({ output: null, error: null, receipt: null });

        try {
            target.disabled = true;
            const toSend = this.state.accountConfirmed ? this.props.MultiSigWallet.methods.revokeConfirmation(this.props.id) : this.props.MultiSigWallet.methods.confirmTransaction(this.props.id);
            const estimatedGas = await toSend.estimateGas({ from: this.props.account });
            const receipt = await toSend.send({
                from: this.props.account,
                gasLimit: estimatedGas
            });

            console.log(receipt);

            this.setState({ receipt });


        } catch (error) {
            console.error(error);
            this.props.onError(error.message);
        } finally {
            target.disabled = this.props.isOwner;
        }
    }

    render() {
        const { accountConfirmed, confirmations, required } = this.state;
        const txt = " [" + confirmations + "/" + required + "]";
        return (
            <form>
                <Button
                    disabled={!this.props.isOwner}
                    type="submit" variant={accountConfirmed ? "danger" : "success"}
                    onClick={(e) => this.handleClick(e)}
                > {(accountConfirmed ? "Revoke" : "Confirm") + txt}
                </Button>
            </form>)
    }
}

export default MSWConfirmation;