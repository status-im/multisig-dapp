import React from 'react';
import { Form, Button, Alert, } from 'react-bootstrap';

function isSuccess(status) {
    return status === "0x1" || status === true;
}
class MSWAddOwner extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            input: {
                owner: ''
            },
            error: null
        };
    }

    handleChangeFile(e) {
        const {input} = this.state;
        input.file = [e.target];
        this.setState({input});
    }

    handleChange(e, name) {
        const {input} = this.state;
        input[name] = e.target.value;
        this.setState({input});
    }

    handleCheckbox(e, name) {
        const {input} = this.state;
        input[name] = e.target.checked;
        this.setState({input});
    }

    async handleClick(e){
        e.preventDefault();
        let target = e.target;
        const {input} = this.state;

        this.setState({error: null, receipt: null});

        try {
            target.disabled=true;
            const toSend = this.props.MultiSigWallet.methods.addOwner(input.owner);

            const MsSend = this.props.MultiSigWallet.methods.submitTransaction(
                this.props.MultiSigWallet._address, 0, toSend.encodeABI()
            )
            const estimatedGas = await MsSend.estimateGas({from: this.props.account});

            const receipt = await MsSend.send({
                from: this.props.account,
                gasLimit: estimatedGas
            });

            this.setState({receipt});


        } catch(err) {
            console.error(err);
            this.setState({error: err.message});
        } finally {
            target.disabled=null;
        }
    }

    render(){
        const {input, error, receipt} = this.state;

        return <div className="formSection">
            <h3>addOwner</h3>
            <form>
                <Form.Group>
                    <Form.Label>owner</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={ input.owner }
                        placeholder="address"
                        onChange={(e) => this.handleChange(e, 'owner')}
                    />
                </Form.Group>

                { error != null && <Alert variant="danger">{error}</Alert> }

                <Button type="submit" variant="primary" onClick={(e) => this.handleClick(e)}>Send</Button>
                {
                receipt &&
                <React.Fragment>
                    <Alert onClose={()=>{}} variant={isSuccess(receipt.status) ? 'success' : 'danger'}>{isSuccess(receipt.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {receipt.transactionHash}</Alert>
                </React.Fragment>

                }
            </form>
        </div>;
    }
}

export default MSWAddOwner;