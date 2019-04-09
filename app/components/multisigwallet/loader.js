import React from 'react';
import { Alert, Form, Button } from 'react-bootstrap';

class ContractLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      strError: null,
      contractAddress: props.address,
    };
  }

  componentDidMount(){
    if(this.state.contractAddress) this.props.onReady(this.state.contractAddress);
  }

  handleAddressChange(event) {
    this.props.onReady(event.target.value);
  }

  handleSumbit(event){
    event.preventDefault();
    this.props.onReady(this.state.contractAddress);
  }

  render() {
    return (
      <div>
        <h2>Existent MultiSigWallet</h2>
        <form>
          <Form.Group>
            <Form.Label>Contract Address:</Form.Label>
            <Form.Control
              type="text"
              defaultValue={this.state.contractAddress}
              placeholder="address"
              onChange={(e) => this.handleAddressChange(e)}
            />
          </Form.Group>
          {this.state.strError != null && <Alert variant="danger">{this.state.strError}</Alert>}
          <Button size="lg" type="submit" variant="primary" onClick={(e) => this.handleSumbit(e)}>Load</Button>
        </form>
      </div>);
  }
}

export default ContractLoader;
