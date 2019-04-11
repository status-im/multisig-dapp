import React from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';
class MSWConfirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountConfirmed: false,
            confirmations: 0,
            required: 0
        };
    }

    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        account: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isOwner: PropTypes.bool,
        onError: PropTypes.func
    }

    static defaultProps = {
        isOwner: false,
        onError: () => {}
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
        const target = e.target;
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
        return (

            <Button
                disabled={!this.props.isOwner}
                type="submit" variant={accountConfirmed ? "danger" : "success"}
                onClick={(e) => this.handleClick(e)}
            >
                <b>{" #" + this.props.id}</b>
                <small>{" [" + confirmations + "/" + required + "] "}</small>
                <svg className="svg-icon" viewBox="0 0 20 20">
                    {accountConfirmed ?
                        <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                        :
                        <path fill="none" d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"></path>
                    }
                </svg>
            </Button>
        )
    }
}

export default MSWConfirmation;