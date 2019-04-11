import React from 'react';
import { CardColumns } from 'react-bootstrap';
import MSWSubmitTransaction from './transaction-submit';
import MSWTransactionCard from './transaction-card';
import PropTypes from 'prop-types';

class MSWTransactionTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filteredCount: "0",
            transactionCount: "0",
            txIds: [],
            strError: null
        }
    }

    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        account: PropTypes.string.isRequired,
        isOwner: PropTypes.bool,
        mode: PropTypes.string
    }

    static defaultProps = {
        isOwner: false,
        string: "all"
    }

    componentDidMount(val) {
        this.load();
    }

    load() {
        const { MultiSigWallet, mode } = this.props;
        var pending, executed;
        switch (mode) {
            case "pending":
                pending = true
                executed = false
                break;
            case "executed":
                pending = false
                executed = true
                break;
            default:
                pending = true
                executed = true

        }
        MultiSigWallet.methods.transactionCount().call().then((transactionCount) => {
            this.setState({ transactionCount });
            MultiSigWallet.methods.getTransactionCount(pending, executed).call().then((filteredCount) => {
                this.setState({ filteredCount });
                MultiSigWallet.methods.getTransactionIds("0", filteredCount, pending, executed).call().then((txIds) => {
                    this.setState({ txIds });
                }).catch(error => {
                    console.error(error);
                    this.setError(error.message)
                })
            }).catch(error => {
                console.error(error);
                this.setError(error.message)
            })
        }).catch(error => {
            console.error(error);
            this.setError(error.message)
        });

    }

    appendNewTx(txId) {
        const txIds = this.state.txIds;
        txIds.push(txId);
        let transactionCount = (+txId+1).toString();
        this.setState({ txIds, transactionCount});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.mode != prevProps.mode) {
            this.load();
        }
    }

    setError(strError) {
        this.setState({ strError: strError })
    }

    render() {
        const txIds = this.state.txIds;
        return (
            <CardColumns>
                {this.props.isOwner && <MSWSubmitTransaction onSubmission={(txId)=>{this.appendNewTx(txId)}}MultiSigWallet={this.props.MultiSigWallet} account={this.props.account} nextId={this.state.transactionCount} />}
                {txIds.reverse().map((value, index) => {
                    return <MSWTransactionCard key={index} id={value} MultiSigWallet={this.props.MultiSigWallet} isOwner={this.props.isOwner} account={this.props.account} />
                })}
            </CardColumns>
        )

    }
}

export default MSWTransactionTable;