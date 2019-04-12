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
    address: '0x0000000000000000000000000000000000000000',
    onChange: () => { }
  }

  componentDidMount() {
    const address = this.state.contractAddress;
    if (address && address != ContractLoader.defaultProps.address) this.props.onChange(address, (error) => this.setState({error}));
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
          Load MultiSigWallet
        </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Form.Label>Contract Address:</Form.Label>
              <ColorAddressInput
                defaultValue={contractAddress}
                onChange={(address) => {
                  this.setState({contractAddress: address});
                  onChange(address, (error) => this.setState({error}))
                }}
              />
            </ListGroup.Item>
        </ListGroup>
        <Card.Body className="text-right">
          <Button size="sm" type="submit" variant="primary" onClick={(e) => this.handleSumbit(e)}>Load <svg className="svg-icon" viewBox="0 0 20 20">
							<path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
						</svg></Button>
        </Card.Body>
        {error != null && <Card.Footer><Alert dismissible onClose={() => this.setState({error: null})} variant="danger">{error}</Alert></Card.Footer>}
      </Card>);
  }
}

export default ContractLoader;
