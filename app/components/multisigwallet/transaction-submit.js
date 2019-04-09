import React from 'react';
import { Form, Button, Alert, Card, ListGroup, Badge, Col, Row } from 'react-bootstrap';
function isSuccess(status) {
    return status === "0x1" || status === true;
}

class MSWSubmitTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {
                destination: '',
                value: '',
                data: ''
            },
            error: null,
        };
    }

    handleChangeFile(e) {
        const { input } = this.state;
        input.file = [e.target];
        this.setState({ input });
    }

    handleChange(e, name) {
        const { input } = this.state;
        input[name] = e.target.value;
        this.setState({ input });
    }

    handleCheckbox(e, name) {
        const { input } = this.state;
        input[name] = e.target.checked;
        this.setState({ input });
    }

    async handleClick(e) {
        e.preventDefault();

        const { input, value } = this.state;

        this.setState({ output: null, error: null, receipt: null });

        try {

            const toSend = this.props.MultiSigWallet.methods.submitTransaction(input.destination, input.value, input.data);

            const estimatedGas = await toSend.estimateGas({ from: this.props.account });

            const receipt = await toSend.send({
                from: this.props.account,
                gasLimit: estimatedGas
            });

            console.log(receipt);

            this.setState({ receipt });


        } catch (err) {
            console.error(err);
            this.setState({ error: err.message });
        }
    }

    render() {
        const { input, error, receipt } = this.state;

        return (
            <Card>
                <Card.Header className="text-center">
                    <Row>
                        <Col className="text-left">Tx #{this.props.nextId}</Col>
                        <Col className="text-right">
                            <Badge className="justify-content-end" variant="primary">New</Badge>
                        </Col>
                    </Row>
                </Card.Header>
                <form>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Form.Control
                                type="text"
                                defaultValue={input.destination}
                                placeholder="destination (address)"
                                onChange={(e) => this.handleChange(e, 'destination')}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Form.Control
                                type="number"
                                defaultValue={input.value}
                                placeholder="value (uint256)"
                                onChange={(e) => this.handleChange(e, 'value')}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Form.Control
                                type="text"
                                defaultValue={input.data}
                                placeholder="data (bytes)"
                                onChange={(e) => this.handleChange(e, 'data')}
                            />
                        </ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        {error != null && <Alert onClose={() => { }} variant="danger">{error}</Alert>}
                        {receipt && <Alert onClose={() => { }} variant={isSuccess(receipt.status) ? 'success' : 'danger'}>{isSuccess(receipt.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {receipt.transactionHash}</Alert>}
                        <Button type="submit" variant="primary" onClick={(e) => this.handleClick(e)}>Send</Button>
                    </Card.Body>
                </form>
            </Card>
        );
    }
}

export default MSWSubmitTransaction;