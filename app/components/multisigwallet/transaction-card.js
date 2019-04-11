import React from 'react';
import { Card, ListGroup, Badge, Spinner, Col, Row, Alert } from 'react-bootstrap';
import ColorEthAddress from '../color-eth-address';
import MSWConfirmation from './confirmation';
import PropTypes from 'prop-types';

class MSWTransactionCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tx: null,
            strError: null
        }
    }

    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        account: PropTypes.string.isRequired,
        isOwner: PropTypes.bool
    }

    static defaultProps = {
        isOwner: false
    }


    componentDidMount() {
        this.load();
    }
    load() {
        this.props.MultiSigWallet.methods.transactions(this.props.id).call().then((val) => {
            this.setState({ tx: val });
        }).catch(error => {
            this.setError(error.toString())
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.id != prevProps.id) {
            this.load();
        }
    }

    setExecuted(executed) {
        const tx = this.state.tx;
        tx.executed = executed;
        if(!executed) {
            this.setError("The approved transaction failed execution.");
        }
        
        this.setState({ tx });
    }

    setError(strError) {
        this.setState({ strError: strError })
    }

    render() {
        const { MultiSigWallet, account, isOwner, id} = this.props;
        const { tx, strError } = this.state;
        return (
            !tx ?
                (<Card>
                    <Card.Header className="text-center">
                        <Row>
                            <Col className="text-left"> Tx #{id} </Col>
                            <Col className="text-right"><Badge variant="info">Loading</Badge></Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Spinner animation="border" variant="info" />
                    </Card.Body>
                </Card>) :
                (<Card>
                    <Card.Header className="text-center">
                        <Row>
                            <Col className="text-left"> Tx #{id} </Col>
                            <Col className="text-right">
                                <Badge variant={tx.executed ? "info" : "warning"}>
                                    {tx.executed ? (
                                        <span>
                                            Executed
                                        <svg className="svg-icon" viewBox="0 0 20 20">
                                                <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                                            </svg>
                                        </span>) : (
                                            <span>
                                                Pending
                                                <svg className="svg-icon" viewBox="0 0 20 20">
                                                    <path d="M10.25,2.375c-4.212,0-7.625,3.413-7.625,7.625s3.413,7.625,7.625,7.625s7.625-3.413,7.625-7.625S14.462,2.375,10.25,2.375M10.651,16.811v-0.403c0-0.221-0.181-0.401-0.401-0.401s-0.401,0.181-0.401,0.401v0.403c-3.443-0.201-6.208-2.966-6.409-6.409h0.404c0.22,0,0.401-0.181,0.401-0.401S4.063,9.599,3.843,9.599H3.439C3.64,6.155,6.405,3.391,9.849,3.19v0.403c0,0.22,0.181,0.401,0.401,0.401s0.401-0.181,0.401-0.401V3.19c3.443,0.201,6.208,2.965,6.409,6.409h-0.404c-0.22,0-0.4,0.181-0.4,0.401s0.181,0.401,0.4,0.401h0.404C16.859,13.845,14.095,16.609,10.651,16.811 M12.662,12.412c-0.156,0.156-0.409,0.159-0.568,0l-2.127-2.129C9.986,10.302,9.849,10.192,9.849,10V5.184c0-0.221,0.181-0.401,0.401-0.401s0.401,0.181,0.401,0.401v4.651l2.011,2.008C12.818,12.001,12.818,12.256,12.662,12.412"></path>
                                                </svg>
                                            </span>)}
                                </Badge>
                            </Col>
                        </Row>
                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><small className="text-secondary">Destination:</small><p><ColorEthAddress address={tx.destination} /></p></ListGroup.Item>
                        <ListGroup.Item><small className="text-secondary">Value:</small><p>{tx.value} wei</p></ListGroup.Item>
                        {tx.data && <ListGroup.Item>
                            <small className="text-secondary">Data:</small>
                            <p><strong>{tx.data.substr(0, 10)}</strong>{tx.data.substr(10)}</p>
                        </ListGroup.Item>}
                    </ListGroup>
                    {!tx.executed &&
                        <Card.Body className="text-right">
                            <MSWConfirmation onExecution={(executed) => this.setExecuted(executed)} onError={(err) => this.setError(err.toString())} MultiSigWallet={MultiSigWallet} isOwner={isOwner} account={account} id={id} />
                        </Card.Body>}
                    {strError != null && <Card.Footer><Alert dismissible onClose={()=>this.setState({strError:null})} variant="danger">{strError}</Alert></Card.Footer>}
                </Card>)
        )

    }
}

export default MSWTransactionCard;