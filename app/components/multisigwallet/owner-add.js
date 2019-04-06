import React, { Fragment } from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Alert, } from 'react-bootstrap';

function isSuccess(status) {
    return status === "0x1" || status === true;
}
class MSWAddOwner extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            account: props.account,
            mswInstance: props.instance,
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
            const toSend = this.state.mswInstance.methods.addOwner(input.owner);

            const MsSend = this.state.mswInstance.methods.submitTransaction(
                this.state.mswInstance._address, 0, toSend.encodeABI()
            )
            const estimatedGas = await MsSend.estimateGas({from: this.state.account});

            const receipt = await MsSend.send({
                from: this.state.account,
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
                <FormGroup>
                    <ControlLabel>owner</ControlLabel>
                    <FormControl
                        type="text"
                        defaultValue={ input.owner }
                        placeholder="address"
                        onChange={(e) => this.handleChange(e, 'owner')}
                    />
                </FormGroup>

                { error != null && <Alert bsStyle="danger">{error}</Alert> }

                <Button type="submit" bsStyle="primary" onClick={(e) => this.handleClick(e)}>Send</Button>
                {
                receipt &&
                <Fragment>
                    <Alert onDismiss={()=>{}} bsStyle={isSuccess(receipt.status) ? 'success' : 'danger'}>{isSuccess(receipt.status) ? 'Success' : 'Failure / Revert'} - Transaction Hash: {receipt.transactionHash}</Alert>
                </Fragment>

                }
            </form>
        </div>;
    }
}

export default MSWAddOwner;