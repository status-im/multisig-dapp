import React from 'react';
import { CardColumns } from 'react-bootstrap';
import MSWSubmitTransaction from './transaction-submit';
import MSWTransactionCard from './transaction-card';


class MSWTransactionTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionCount: 0,
            loadedCount: 0,
            txIds: [],
            executedTxs: [],
            pendingTxs: [],
            strError: null
        }
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
        console.log("this.props.pending, this.props.executed", pending, executed)
        MultiSigWallet.methods.getTransactionCount(pending, executed).call().then((count) => {
            console.log("count", count);
            this.setState({ transactionCount: +count });
            MultiSigWallet.methods.getTransactionIds("0", count, pending, executed).call().then((txIds) => {
                console.log(txIds);
                this.setState({ txIds: txIds });
            }).catch(error => {
                console.error(error);
                this.setError(error.message)
            })
        }).catch(error => {
            console.error(error);
            this.setError(error.message)
        })
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
                {this.props.isOwner && <MSWSubmitTransaction MultiSigWallet={this.props.MultiSigWallet} nextId={this.state.transactionCount}/>}
                {txIds.reverse().map((value, index) => {
                    return <MSWTransactionCard key={index} id={value} MultiSigWallet={this.props.MultiSigWallet} isOwner={this.props.isOwner} account={this.props.account} />
                })}
            </CardColumns>
        )

    }
}

export default MSWTransactionTable;