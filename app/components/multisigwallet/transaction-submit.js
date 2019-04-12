import React from 'react';
import { Form,  Alert, Card, ListGroup, Badge, Col, Row, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import ColorAddressInput from '../color-address-input';
import PropTypes from 'prop-types';
import TransactionSubmitButton from '../transaction-submit-button';
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

    handleNewDest(address) {
        const { input } = this.state;
        input.destination = address;
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
                badgeIcon = (<path d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z"></path>)
                badgeText = "New"
                break;
            case 'warning':
                badgeIcon = (<path d="M15.684,16.959L10.879,8.52c0.886-0.343,1.517-1.193,1.517-2.186c0-1.296-1.076-2.323-2.396-2.323S7.604,5.037,7.604,6.333c0,0.993,0.63,1.843,1.517,2.186l-4.818,8.439c-0.189,0.311,0.038,0.708,0.412,0.708h10.558C15.645,17.667,15.871,17.27,15.684,16.959 M8.562,6.333c0-0.778,0.645-1.382,1.438-1.382s1.438,0.604,1.438,1.382c0,0.779-0.645,1.412-1.438,1.412S8.562,7.113,8.562,6.333 M5.55,16.726L10,8.91l4.435,7.815H5.55z M15.285,9.62c1.26-2.046,1.26-4.525,0-6.572c-0.138-0.223-0.064-0.512,0.162-0.646c0.227-0.134,0.521-0.063,0.658,0.16c1.443,2.346,1.443,5.2,0,7.546c-0.236,0.382-0.641,0.17-0.658,0.159C15.221,10.131,15.147,9.842,15.285,9.62 M13.395,8.008c0.475-1.063,0.475-2.286,0-3.349c-0.106-0.238,0.004-0.515,0.246-0.62c0.242-0.104,0.525,0.004,0.632,0.242c0.583,1.305,0.583,2.801,0,4.106c-0.214,0.479-0.747,0.192-0.632,0.242C13.398,8.523,13.288,8.247,13.395,8.008 M3.895,10.107c-1.444-2.346-1.444-5.2,0-7.546c0.137-0.223,0.431-0.294,0.658-0.16c0.226,0.135,0.299,0.424,0.162,0.646c-1.26,2.047-1.26,4.525,0,6.572c0.137,0.223,0.064,0.512-0.162,0.646C4.535,10.277,4.131,10.489,3.895,10.107 M5.728,8.387c-0.583-1.305-0.583-2.801,0-4.106c0.106-0.238,0.39-0.346,0.631-0.242c0.242,0.105,0.353,0.382,0.247,0.62c-0.475,1.063-0.475,2.286,0,3.349c0.106,0.238-0.004,0.515-0.247,0.62c-0.062,0.027-0.128,0.04-0.192,0.04C5.982,8.668,5.807,8.563,5.728,8.387"></path>)
                badgeText = "Broadcasted"
                break;
            case 'success':
                badgeIcon = (<path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>);
                badgeText = "Submitted"
                break;
            case 'danger':
            default:
                badgeText = "Error"
                badgeIcon = (<path d="M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221"></path>);

        }
        return (
            <Card border={variant}>
                <Card.Header className="text-center">
                    <Row>
                        <Col className="text-left">Tx #{nextId}</Col>
                        <Col className="text-right">
                            <Badge
                                className="justify-content-end"
                                variant={variant}>
                                {badgeText}
                                <svg className="svg-icon" viewBox="0 0 20 20">
                                    {badgeIcon}
                                </svg>
                            </Badge>
                        </Col>
                    </Row>
                </Card.Header>
                <form>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <ColorAddressInput
                                defaultValue={input.destination}
                                placeholder="destination (address)"
                                disabled={disabled}
                                onChange={(e) => this.handleNewDest(e)}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
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
                            <Form.Control
                                as="textarea"
                                type="text"
                                defaultValue={input.data}
                                placeholder="data (bytes)"
                                disabled={disabled}
                                onChange={(e) => this.handleChange(e, 'data')}
                            />
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
                                    <svg className="svg-icon" viewBox="0 0 20 20">
                                        <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
                                    </svg>
                                }
                                text={('Send')}
                                />
                        </Card.Body>}
                    {(error || result) &&
                        <Card.Footer>
                            {error != null && <Alert dismissible onClose={() => { this.setState({ error: null }) }} variant="danger">{error}</Alert>}
                            {result && <Alert dismissible onClose={() => { this.clearReceipt() }} variant={variant}>{isSuccess(result.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {result.transactionHash}</Alert>}
                        </Card.Footer>}
                </form>
            </Card>
        );
    }
}

export default MSWSubmitTransaction;