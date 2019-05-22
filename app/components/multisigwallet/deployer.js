import React from 'react';
import PropTypes from 'prop-types';
import MultiSigWallet from 'Embark/contracts/MultiSigWallet';
import TransactionSubmitButton from '../TransactionSubmitButton';
import { Alert, Form,  Card, ListGroup,  Badge, Col, Row } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import EthAddress from '../EthAddress';
import EthAddressList from '../EthAddressList';
import IconDeploy from '../icon/Deploy'

class MSWDeployer extends React.Component {

    constructor(props) {
        super(props);
        this.onDeploy = this.onDeploy.bind(this);
        this.state = {
            txHash: null,
            strError: null,
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

    onOwnersChange(list) {
        let owners = list.listItems.map((val) => { return val.text }).filter(val => {
            return val != null;
        })
        this.setState({ owners: owners });
    }

    setRequired(val) {
        this.setState({ required: val });
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
    
    setAddress(address, index) {
        console.log(address,index)
        var owners = this.state.owners;
        if(index == owners.length){
            owners.push(address);
        } else{
            owners[index] = address;
        }
        
        this.setState({owners});
    }

    render() {
        const { account } = this.props;
        const { owners, required, strError } = this.state;

        const list = owners.map((value, index) => {
            return <div key={index}><EthAddress 
                control={true}
                value={value}
                onChange={(address) => {
                    this.setAddress(address, index);
                }}
              /></div>
        })

        list.push(<div key={list.length}><EthAddress 
            control={true}
            onChange={(address) => {
                this.setAddress(address, list.length);
            }}
          /></div>)
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
                        <EthAddressList addresses={owners} onChange={(owners) => this.setState({owners})} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Label>Required:</Form.Label>
                        <div>{required} of {owners.length}
                        <Slider dots={true} min={0} max={owners.length} step={1} defaultValue={required} onChange={this.setRequired.bind(this)} />
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
                            <IconDeploy/>
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
