import React from 'react';
import { Alert, Form, Button, Card, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ColorAddressInput from '../color-address-input';

class ContractLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
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
    if (this.state.contractAddress) this.props.onChange(this.state.contractAddress, (error) => this.setState({error}));
  }

  handleSumbit(event) {
    event.preventDefault();
    this.props.onChange(this.state.contractAddress, (error) => this.setState({error}));
  }

  render() {
    const { contractAddress, error } = this.state;
    const { onChange } = this.props;
    return (
      <Card>
        <Card.Header>
          Load Existent MultiSigWallet
        </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Form.Label>Contract Address:</Form.Label>
              <ColorAddressInput
                defaultValue={contractAddress}
                placeholder="address"
                onChange={(address) => {
                  this.setState({contractAddress: address});
                  onChange(address, (error) => this.setState({error}))
                }}
              />
            </ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button size="sm" type="submit" variant="primary" onClick={(e) => this.handleSumbit(e)}>Load</Button>
        </Card.Body>
        {error != null && <Card.Footer><Alert dismissible onClose={() => this.setState({error: null})} variant="danger">{error}</Alert></Card.Footer>}
      </Card>);
  }
}

export default ContractLoader;
