import React from 'react';
import { Card, Accordion, ListGroup, Badge, Spinner, Col, Row, Alert } from 'react-bootstrap';
import EthAddress from '../EthAddress';
import MSWConfirmation from './confirmation';
import PropTypes from 'prop-types';
import WaitingIcon from '../icon/Waiting';
import AcceptedIcon from '../icon/Accepted'
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
                    <Accordion.Toggle as={Card.Header} eventKey={id} className="text-center">
                        <Row>
                            <Col className="text-left"> Tx #{id} </Col>
                            <Col className="text-right"><Badge variant="info">Loading</Badge></Col>
                        </Row>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={id}>
                        <Card.Body>
                            <Spinner animation="border" variant="info" />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>) :
                (<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={id} className="text-center">
                        <Row>
                            <Col className="text-left"> Tx #{id} </Col>
                            <Col className="text-right">
                                <Badge variant={tx.executed ? "info" : "warning"}>
                                    {tx.executed ? 
                                    (<span>
                                        Executed
                                        <AcceptedIcon/>
                                    </span>) 
                                    : 
                                    (<span>
                                        Pending
                                        <WaitingIcon/>
                                    </span>)}
                                </Badge>
                            </Col>
                        </Row>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={id}>
                        <React.Fragment>
                            <ListGroup variant="flush">
                                <ListGroup.Item><small className="text-secondary">Destination:</small><EthAddress blockyScale={4} value={tx.destination} /></ListGroup.Item>
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
                        </React.Fragment>
                    </Accordion.Collapse>
                </Card>)
        )

    }
}

export default MSWTransactionCard;