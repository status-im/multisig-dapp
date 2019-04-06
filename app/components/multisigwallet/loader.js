import React from 'react';
import EmbarkJS from 'Embark/EmbarkJS';
import MultiSigWallet from 'Embark/contracts/MultiSigWallet';
import { Alert, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class MSWLoader extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      strError: null,
      account: props.account,
      isOwner: false,
      contractAddress: props.address,
    };
  }

  componentDidMount() {
    if (this.props.address) {
      this.setContractAddress(this.props.address);
    }
  }

  handleChange(instance, isOwner = false) {
    this.props.onReady(instance, isOwner);
  }

  handleAddressChange(event) {
    this.setContractAddress(event.target.value);
  }

  handleSumbit(event){
    event.preventDefault();
    this.checkContractAddress();
  }

  setContractAddress(address) {
    try {
      let checksumAddress = web3.utils.toChecksumAddress(address);
      this.setState({ contractAddress: checksumAddress });
      this.checkContractAddress();
    }catch(error){
      this.setState({ strError: error.toString() })
    }
    
  }

  async checkContractAddress() {
    this.setState({ strError: null });
    try {
      let code = await web3.eth.getCode(this.state.contractAddress);
      if (code.length > 2) {
        this.setMSWInstance(new EmbarkJS.Blockchain.Contract({abi: MultiSigWallet._jsonInterface, address: this.state.contractAddress }))
      } else {
        this.setState({ strError: "Not a smart contract" })
      }
    } catch (error) {
      this.setState({ strError: error.toString() })
    }
  }

  async setMSWInstance(mswInstance){
    try {
      let req = await mswInstance.methods.required().call(); //catch not multisig eallrt
      if (req > 0) {
        var isOwner = false;
        try {
          if (this.props.account) {
            isOwner = await mswInstance.methods.isOwner(this.props.account).call()
          }
        } catch (error) {
          this.setState({ strError: error.toString() })
        }
        this.setState({ isOwner: isOwner});
        this.handleChange(mswInstance, isOwner);
      } else {
        this.setState({ strError: "Invalid MultiSigWallet" })
      }
    } catch (error) {
      this.setState({ strError: "Not a Multisig Wallet" })
    }
  }

  render() {
    return (
      <div>
        <h2>Existent MultiSigWallet</h2>
        <form>
          <FormGroup>
            <ControlLabel>Contract Address:</ControlLabel>
            <FormControl
              type="text"
              defaultValue={this.state.contractAddress}
              placeholder="address"
              onChange={(e) => this.handleAddressChange(e)}
            />
          </FormGroup>
          {this.state.strError != null && <Alert bsStyle="danger">{this.state.strError}</Alert>}
          <Button bsSize="lg" type="submit" bsStyle="primary" onClick={(e) => this.handleSumbit(e)}>Load</Button>
        </form>
      </div>);
  }
}

export default MSWLoader;
