import React from 'react';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../transaction-submit-button';
import { ButtonGroup } from 'react-bootstrap';
class MSWConfirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountConfirmed: false,
            confirmations: 0,
            required: 0,
            txHash: null
        };
    }

    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
        account: PropTypes.string,
        onExecution: PropTypes.func,
        onError: PropTypes.func
    }

    static defaultProps = {
        account: null,
        onError: () => {}
    }

    componentDidMount() {
        this.props.MultiSigWallet.methods.required().call().then((required) => {
            this.setState({ required: required });
        })
        this.props.MultiSigWallet.methods.getConfirmationCount(this.props.id).call().then((confirmations) => {
            this.setState({ confirmations: confirmations });
        })
        if (this.props.account) {
            this.props.MultiSigWallet.methods.confirmations(this.props.id, this.props.account).call().then((accountConfirmed) => {
                this.setState({ accountConfirmed: accountConfirmed });
            })
        }
    }

    handleResult(result) {
        const events = result.events;
        if(events.Confirmation){
            if(events.Confirmation.returnValues.transactionId == this.props.id){
                const result = +this.state.confirmations+1;
                this.setState({ confirmations: result } )
            }
            if(events.Confirmation.returnValues.sender == this.props.account){
                this.setState({ accountConfirmed: true });
            }  
        }
        if(events.Revocation){
            if(events.Revocation.returnValues.transactionId == this.props.id){
                const result = +this.state.confirmations-1;
                this.setState({ confirmations: result } )
            }
            if(events.Revocation.returnValues.sender == this.props.account){
                this.setState({ accountConfirmed: false });
            }        
        } 
        if(events.Execution){
            if(events.Execution.returnValues.transactionId == this.props.id){
                this.props.onExecution(true);
            }
        }
        if(events.ExecutionFailure){
            if(events.ExecutionFailure.returnValues.transactionId == this.props.id){
                this.props.onExecution(false);
            }
        }
    }

    handleError(error) {
        this.props.onError(error.message);
    }

    handleSubmission(txHash) {
        this.setState({ txHash });
    }

    render() {
        const { accountConfirmed, confirmations, required } = this.state;
        const { MultiSigWallet, id, account} = this.props;
        return (
            <ButtonGroup aria-label="Transaction Actions">
                { (confirmations >= required) &&
                <TransactionSubmitButton 
                    account={account}
                    sendTransaction={
                        MultiSigWallet.methods.executeTransaction(id)
                    }
                    onSubmission={(txHash) => this.handleSubmission(txHash) }
                    onResult={(result) => this.handleResult(result) }
                    onError={(error) => this.handleError(error) }
                    icon={
                        <svg className="svg-icon" viewBox="0 0 20 20">
							<path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
						</svg>
                    }
                    text="Execute"
                    variant={accountConfirmed ? "danger" : "success"}
                    />
                }
                <TransactionSubmitButton 
                    account={account}
                    sendTransaction={
                        accountConfirmed ? 
                            MultiSigWallet.methods.revokeConfirmation(id)
                            : 
                            MultiSigWallet.methods.confirmTransaction(id)
                    }
                    onSubmission={(txHash) => this.handleSubmission(txHash) }
                    onResult={(result) => this.handleResult(result) }
                    onError={(error) => this.handleError(error) }
                    icon={
                        <svg className="svg-icon" viewBox="0 0 20 20">
                            {accountConfirmed ?
                                <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                                :
                                <path fill="none" d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"></path>
                            }
                        </svg>
                    }
                    text={
                        <React.Fragment>
                            <b>{" #" + id}</b>
                            <small>{" [" + confirmations + "/" + required + "] "}</small>
                        </React.Fragment>
                    }
                    variant={accountConfirmed ? "danger" : "success"}
                    />
            </ButtonGroup>
            
        )
    }
}

export default MSWConfirmation;