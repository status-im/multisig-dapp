import React from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ColorAddressInput from '../color-address-input';

class ContractLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      strError: null,
      contractAddress: props.address,
    };
  }
  static propTypes = {
    account: PropTypes.string,
    address: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    account: '',
    address: '',
    onChange: () => { }
  }

  componentDidMount() {
    if (this.state.contractAddress) this.props.onChange(this.state.contractAddress);
  }

  handleSumbit(event) {
    event.preventDefault();
    this.props.onChange(this.state.contractAddress);
  }

  render() {
    return (
      <div>
        <h2>Existent MultiSigWallet</h2>
        <form>
          <Form.Group>
            <Form.Label>Contract Address:</Form.Label>
            <ColorAddressInput
              defaultValue={this.state.contractAddress}
              placeholder="address"
              onChange={(address) => this.props.onChange(address)}
            />
          </Form.Group>
          {this.state.strError != null && <Alert variant="danger">{this.state.strError}</Alert>}
          <Button size="lg" type="submit" variant="primary" onClick={(e) => this.handleSumbit(e)}>Load</Button>
        </form>
      </div>);
  }
}

export default ContractLoader;
