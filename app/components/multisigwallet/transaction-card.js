import React from 'react';
import { Card, ListGroup, Badge, Spinner, Col, Row } from 'react-bootstrap';
import ColorEthAddress from '../color-eth-address';
import MSWConfirmation from './confirmation';


class MSWTransactionCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tx: null,
            strError: null
        }
    }

    componentDidMount() {
        this.load();
    }
    load() {
        this.props.MultiSigWallet.methods.transactions(this.props.id).call().then((val) => {
            this.setState({ tx: val });
        }).catch(error => {
            console.error(error);
            this.setError(error.message)
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.id != prevProps.id) {
            this.load();
        }
    }


    setError(strError) {
        this.setState({ strError: strError })
    }

    render() {
        const { id } = this.props;
        const { tx } = this.state;
        return (
            !tx ?
                <Card>
                    <Card.Header className="text-center">
                        <Row>
                            <Col className="text-left"> Tx #{id} </Col>
                            <Col className="text-right"><Badge variant="info">Loading</Badge></Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Spinner animation="border" variant="info" />
                    </Card.Body>
                </Card> :
                <Card>
                    <Card.Header className="text-center">
                        <Row>
                            <Col className="text-left"> Tx #{id} </Col>
                            <Col className="text-right">
                                <Badge variant={tx.executed ? "info" : "warning"}>
                                    {tx.executed ? "Executed" : "Pending"}
                                </Badge>
                            </Col>
                        </Row>


                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><small bsClass="text-secondary">Destination:</small><p><ColorEthAddress address={tx.destination} /></p></ListGroup.Item>
                        <ListGroup.Item><small bsClass="text-secondary">Value:</small><p>{tx.value} wei</p></ListGroup.Item>
                        {tx.data && <ListGroup.Item>
                            <small bsClass="text-secondary">Data:</small>
                            <p><strong>{tx.data.substr(0, 10)}</strong>{tx.data.substr(10)}</p>
                        </ListGroup.Item>}
                    </ListGroup>
                    <Card.Body>
                        {!tx.executed && <MSWConfirmation onError={this.setError} MultiSigWallet={this.props.MultiSigWallet} isOwner={this.props.isOwner} account={this.props.account} id={this.props.id} />}
                    </Card.Body>
                </Card>
        )

    }
}

export default MSWTransactionCard;