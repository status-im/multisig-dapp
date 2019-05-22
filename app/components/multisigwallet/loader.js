import React from 'react';
import { Alert, Form, Button, Card, ListGroup,  Badge, Col, Row  } from 'react-bootstrap';
import PropTypes from 'prop-types';
import EthAddress from '../EthAddress';
import IconSearch from '../icon/Search';

class ContractLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      address: props.address,
      value: props.address
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
    this.props.onChange(this.state.address, (error) => this.setState({error}));
  }

  render() {
    const { address, value, error } = this.state;
    const { onChange } = this.props;
    return (
      <Card>
        <Card.Header>
          <Row>
              <Col className="text-left"> Existent </Col>
              <Col className="text-right"><Badge variant="primary">Load</Badge></Col>
          </Row>
        </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Form.Label>Contract Address:</Form.Label>
              <EthAddress 
                control={true}
                value={value}
                onChange={(address, value) => {
                  this.setState({address, value});
                  this.props.onChange(address, (error) => this.setState({error}))
                }}
              />
            </ListGroup.Item>
        </ListGroup>
        <Card.Body className="text-right">
          <Button size="sm" type="submit" variant="primary" onClick={(e) => this.handleSumbit(e)}>Load <IconSearch/></Button>
        </Card.Body>
        {error != null && <Card.Footer><Alert dismissible onClose={() => this.setState({error: null})} variant="danger">{error}</Alert></Card.Footer>}
      </Card>);
  }
}

export default ContractLoader;
