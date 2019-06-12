import React from 'react';
import { Form, Accordion, Alert, Card, ListGroup, Badge, Col, Row, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import EthAddress from '../EthAddress';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../TransactionSubmitButton';
import IconExecute from '../icon/Execute';
import IconDeploy from '../icon/Deploy';
import IconBroadcast from '../icon/Broadcast';
import IconAccepted from '../icon/Accepted';
import IconError from '../icon/Error';

function isSuccess(status) {
    return status === "0x1" || status === true;
}
function getVariant(result, error, txHash) {
    if (error) {
        return 'danger';
    }
    if (!result) {
        return txHash ? 'warning' : 'primary';
    }
    return isSuccess(result.status) ? 'success' : 'danger';
}

class MSWSubmitTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {
                destination: '0x0000000000000000000000000000000000000000',
                dValue: '0x0000000000000000000000000000000000000000',
                value: '',
                data: '',
                valueType: 'ether',
                dot: false
            },
            error: null,
            txHash: null,
            result: null
        };
    }

    static propTypes = {
        MultiSigWallet: PropTypes.object.isRequired,
        account: PropTypes.string.isRequired,
        nextId: PropTypes.string.isRequired,
        onSubmission: PropTypes.func
    }

    static defaultProps = {
        onSubmission: () => { }
    }

    handleChangeFile(e) {
        const { input } = this.state;
        input.file = [e.target];
        this.setState({ input });
    }
    setValueType(valueType) {
        const { input } = this.state;
        input.valueType = valueType;
        this.setState({ input });
    }

    setValue(e) {
        const { input } = this.state;
        try {
            if (e.target.value) {
                input.dot = e.target.value.endsWith('.') || e.target.value.endsWith(',');
                input.value = web3.utils.toWei(e.target.value, input.valueType);
            } else {
                input.value = "0"
            }
            this.setState({ input });
        } catch (err) {
            this.setState({ error: err.message });
        }

    }

    handleChange(e, name) {
        const { input } = this.state;
        input[name] = e.target.value;
        this.setState({ input });
    }

    handleNewDest(address, dValue) {
        const { input } = this.state;
        input.destination = address;
        input.dValue = dValue;
        this.setState({ input });
    }

    handleCheckbox(e, name) {
        const { input } = this.state;
        input[name] = e.target.checked;
        this.setState({ input });
    }
    
    handleResult(result) {
        this.setState({ result });
    }

    handleError(error) {
        this.setState({ error: error.toString() });
    }

    handleSubmission(txHash) {
        this.setState({ txHash });
    }

    clearReceipt() {
        this.props.onSubmission(
            this.state.result.events.Submission.returnValues.transactionId
        );
        this.setState({ result: null, txHash: null })
    }

    render() {
        const { input, error, result, txHash } = this.state;
        const { MultiSigWallet, account, nextId} = this.props;
        const variant = getVariant(result, error, txHash);
        const disabled = txHash!=null;
        var badgeIcon;
        var badgeText;
        switch (variant) {
            case 'primary':
                badgeIcon = (<IconDeploy/>)
                badgeText = "New"
                break;
            case 'warning':
                badgeIcon = (<IconBroadcast/>)
                badgeText = "Broadcasted"
                break;
            case 'success':
                badgeIcon = (<IconAccepted/>);
                badgeText = "Submitted"
                break;
            case 'danger':
            default:
                badgeIcon = (<IconError/>);
                badgeText = "Error"

        }
        return (
            <Card border={variant}>
                <Accordion.Toggle as={Card.Header} eventKey={nextId} className="text-center">                
                    <Row>
                        <Col className="text-left">Tx #{nextId}</Col>
                        <Col className="text-right">
                            <Badge
                                className="justify-content-end"
                                variant={variant}>
                                {badgeText}
                                {badgeIcon}
                            </Badge>
                        </Col>
                    </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={nextId}>
                    <React.Fragment>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <small className="text-secondary">Destination:</small>
                                <EthAddress 
                                    control={true}
                                    allowZero={true}
                                    value={input.dValue}
                                    disabled={disabled}
                                    onChange={(address,dValue) => this.handleNewDest(address,dValue)}
                                    />
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <small className="text-secondary">Value:</small>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        value={web3.utils.fromWei(input.value, input.valueType).toString() + (input.dot ? '.' : '')}
                                        placeholder="value (uint256)"
                                        disabled={disabled}
                                        onChange={(e) => this.setValue(e)
                                        }
                                    />
                                    <DropdownButton
                                        as={InputGroup.Append}
                                        variant="outline-secondary"
                                        title={input.valueType}
                                    >
                                        <Dropdown.Item onSelect={(e) => this.setValueType('ether')}>ether</Dropdown.Item>
                                        <Dropdown.Item onSelect={(e) => this.setValueType('finney')}>finney</Dropdown.Item>
                                        <Dropdown.Item onSelect={(e) => this.setValueType('szabo')}>szabo</Dropdown.Item>
                                        <Dropdown.Item onSelect={(e) => this.setValueType('gwei')}>gwei</Dropdown.Item>
                                        <Dropdown.Item onSelect={(e) => this.setValueType('wei')}>wei</Dropdown.Item>
                                    </DropdownButton>
                                </InputGroup>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <small className="text-secondary">Data:</small>
                                <p><Form.Control
                                    as="textarea"
                                    type="text"
                                    defaultValue={input.data}
                                    placeholder="data (bytes)"
                                    disabled={disabled}
                                    onChange={(e) => this.handleChange(e, 'data')}
                                /></p>
                            </ListGroup.Item>
                        </ListGroup>
                        {!result &&
                            <Card.Body className="text-right">
                                <TransactionSubmitButton 
                                    account={account}
                                    sendTransaction={
                                        MultiSigWallet.methods.submitTransaction(
                                            input.destination,
                                            input.value ? input.value : "0",
                                            input.data ? input.data : "0x"
                                        )
                                    }
                                    onSubmission={(txHash) => this.handleSubmission(txHash) }
                                    onResult={(result) => this.handleResult(result) }
                                    onError={(error) => this.handleError(error) }
                                    icon={
                                        <IconExecute/>
                                    }
                                    text={('Send')}
                                    />
                            </Card.Body>}
                        {(error || result) &&
                            <Card.Footer>
                                {error != null && <Alert dismissible onClose={() => { this.setState({ error: null }) }} variant="danger">{error}</Alert>}
                                {result && <Alert dismissible onClose={() => { this.clearReceipt() }} variant={variant}>{isSuccess(result.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {result.transactionHash}</Alert>}
                            </Card.Footer>}
                    </React.Fragment>
                </Accordion.Collapse>
            </Card>
        );
    }
}

export default MSWSubmitTransaction;