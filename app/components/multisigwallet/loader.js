import React from 'react';
import { Alert, Form, Button, Card, ListGroup,  Badge, Col, Row  } from 'react-bootstrap';
import PropTypes from 'prop-types';
import EthAddress from '../EthAddress';
import IconSearch from '../icon/Search';
const nullAddress = "0x0000000000000000000000000000000000000000"
class ContractLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      value: '',
      address: ''
    };
  }
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    value: '',
    onChange: () => { }
  }

  componentDidMount() {
    this.setValue(null, this.props.value || this.props.defaultValue);
  }

  setValue(address, value) {
    this.setState({address, value});
    if (address && address != nullAddress) this.props.onChange(address, (error) => this.setState({error}));
  }

  handleSumbit(event) {
    event.preventDefault();
    this.props.onChange(this.state.address, (error) => this.setState({error}));
  }
  render() {
    const { value, error } = this.state;
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
                allowZero={false}
                onChange={(address, value) => {
                  this.setValue(address, value);
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
