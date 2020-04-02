import React from 'react';
import PropTypes from 'prop-types';
import MultiSigWallet from '../../../embarkArtifacts/contracts/MultiSigWallet';
import TransactionSubmitButton from '../TransactionSubmitButton';
import { Alert, Form,  Card, ListGroup,  Badge, Col, Row, Button } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import EthAddressList from '../EthAddressList';
import IconDeploy from '../icon/Deploy'
import IconAdd from '../icon/Add'
import IconMore from '../icon/More'

class MSWDeployer extends React.Component {

    constructor(props) {
        super(props);
        this.onDeploy = this.onDeploy.bind(this);
        this.state = {
            txHash: null,
            strError: null,
            values: props.account ? [props.account] : [],
            owners: props.account ? [props.account] : [],
            required: 1
        };
    }

    static propTypes = {
        account: PropTypes.string.isRequired,
        onDeploy: PropTypes.func
    }

    static defaultProps = {
        onReady: () => { }
    }


    onDeploy(MultiSigWallet) {
        this.props.onDeploy(MultiSigWallet);
    }

    setRequired(val) {
        this.setState({ required: val });
    }

    setValues(owners, values) {
        this.setState({owners,values});
    }

    handleResult(result) {
        this.onDeploy(result);
    }

    handleError(error) {
        const { owners, required } = this.state;
        if (required == 0) {
            this.setState({ strError: "Required cannot be zero" });
        } else if (owners.length < required) {
            this.setState({ strError: "Required cannot be more then owners lenght" })
        } else {
            if (new Set(owners).size !== owners.length) {
                this.setState({ strError: "Cannot have duplicate owners" })
            } else {
                this.setState({ strError: error.toString() })
            }
        }
    }

    handleSubmission(txHash) {
        this.setState({ txHash });
    }

        
    addAddress() {
        const values = this.state.values.slice(0);
        const owners = this.state.owners.slice(0);
        values.push("0x0000000000000000000000000000000000000000");
        owners.push("0x0000000000000000000000000000000000000000");

        this.setState({values, owners});
    }

    render() {
        const { account } = this.props;
        const { values, owners, required, strError } = this.state;

        return(
            <Card>
                <Card.Header>
                    <Row>
                        <Col className="text-left"> Deploy </Col>
                        <Col className="text-right"><Badge variant="primary">New</Badge></Col>
                    </Row>
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Form.Label>Owners:</Form.Label>
                        <EthAddressList values={values} onChange={(owners,values)=>this.setState({owners,values})} />
                        <Button 
                            size="sm" 
                            variant="primary" 
                            onClick={() => this.addAddress()} 
                            className="btn-circle" >Add Item <IconAdd/></Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Label>Required:</Form.Label>
                        <div>{required} of {values.length}
                        <Slider dots={true} min={1} max={values.length} step={1} defaultValue={required} onChange={this.setRequired.bind(this)} />
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                <Card.Body className="text-right">
                    <TransactionSubmitButton 
                        account={account}
                        sendTransaction={
                            MultiSigWallet.deploy({ arguments: [owners, required] })
                        }
                        onSubmission={(txHash) => this.handleSubmission(txHash) }
                        onResult={(result) => this.handleResult(result) }
                        onError={(error) => this.handleError(error) }
                        icon={
                            <IconMore/>
                        }
                        text="Deploy"
                        size="sm"
                        />
                </Card.Body>
                {strError != null && 
                <Card.Footer>
                    <Alert 
                        dismissible
                        onClose={() => { this.setState({ strError: null }) }} 
                        variant="danger">
                        {strError}
                    </Alert>
                </Card.Footer>}
            </Card>);
    }
}

export default MSWDeployer;
