import React from 'react';
import PropTypes from 'prop-types';
import MultiSigWallet from 'Embark/contracts/MultiSigWallet';
import TransactionSubmitButton from '../transaction-submit-button';
import { Alert, Form,  Card, ListGroup } from 'react-bootstrap';
import EditableList from '../editable-list'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


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
    
    render() {
        const { account } = this.props;
        const { owners, required, strError } = this.state;
        return(
            <Card>
                <Card.Header>
                    Deploy MultiSigWallet
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Form.Label>Owners:</Form.Label>
                        <EditableList onChange={this.onOwnersChange.bind(this)} title="Owners" items={owners} itemPlaceholder="+" />
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
                            <svg className="svg-icon" viewBox="0 0 20 20">
							    <path d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z"></path>
						    </svg>
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
