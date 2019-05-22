import React from 'react';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../TransactionSubmitButton';
import { ButtonGroup } from 'react-bootstrap';
import IconApprove from "../icon/Approve";
import IconReject from "../icon/Reject";
import IconExecute from "../icon/Execute";

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
                        <IconExecute/>
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
                    icon={accountConfirmed ?
                        <IconReject/>
                        :
                        <IconApprove/>
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