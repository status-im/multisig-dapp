import React from 'react';
import { Accordion, Alert, CardColumns, Pagination } from 'react-bootstrap';
import MSWSubmitTransaction from './transaction-submit';
import MSWTransactionCard from './transaction-card';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
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
        mode: PropTypes.string,
        pageSize: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ]),
        page: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ])
    }

    static defaultProps = {
        isOwner: false,
        mode: "all",
        pageSize: 10,
        page: 1
    }

    componentDidMount() {
        this.load();
    }


    load() {
        const { MultiSigWallet, mode, pageSize, page } = this.props;
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
                this.loadPage()
            }).catch(error => {
                this.setError(error.message)
            })
        }).catch(error => {
            this.setError(error.message)
        });

    }

    loadPage() {
        const { MultiSigWallet, mode, pageSize, page } = this.props;
        const { filteredCount } = this.state;
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
        var start = +filteredCount - (pageSize * page);
        var end = +start+pageSize;
        console.log(end);
        if(start < 0) {
            start = 0;
        }
        if(end < start) {
            end = start;
        }
        console.log(start,end,filteredCount);
        MultiSigWallet.methods.getTransactionIds(start, end, pending, executed).call().then((txIds) => {
            this.setState({ txIds });
        }).catch(error => {
            this.setError(error.message)
        })
    }
    appendNewTx(txId) {
        const txIds = this.state.txIds;
        txIds.push(txId);
        let transactionCount = (+txId+1).toString();
        this.setState({ txIds, transactionCount});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.mode != prevProps.mode) {
            console.log("loading")
            this.load();
        } else if(prevProps.page != this.props.page) {
            console.log("loading page")
            this.loadPage();
        }
    }

    setError(strError) {
        this.setState({ strError: strError })
    }

    render() {
        const { txIds, transactionCount, strError, filteredCount  } = this.state;
        const { MultiSigWallet, isOwner, account, page, pageSize, mode } = this.props;
        
        let totalPages = Math.ceil(filteredCount / pageSize);
        let items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item key={i} active={i === page} href={"#" + MultiSigWallet.options.address + "/transactions/" + mode + "/" + i +"/" }>{i}   
                </Pagination.Item>,
            );
        }

        return (
            <Accordion defaultActiveKey={transactionCount}>
                {totalPages > 1 && <Pagination>{items}</Pagination>}
                <CardColumns>
                    {strError != null && <Alert dismissible onClose={() => { this.setState({ strError: null }) }} variant="danger">{strError}</Alert>}
                    {isOwner && 
                        <MSWSubmitTransaction 
                            onSubmission={(txId)=>{this.appendNewTx(txId)}}
                            MultiSigWallet={MultiSigWallet}
                            account={account} 
                            nextId={transactionCount} />}
                    {txIds.reverse().map((value, index) => {
                        return (<MSWTransactionCard 
                            key={index} 
                            id={value} 
                            MultiSigWallet={MultiSigWallet} 
                            isOwner={isOwner} 
                            account={account} />)
                    })}
                </CardColumns>
            </Accordion>
        )

    }
}

export default MSWTransactionTable;