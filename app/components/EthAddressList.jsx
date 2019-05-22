import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import EthAddress from './EthAddress';
import uuidv4 from 'uuid/v4';
import TrashIcon from "./Icon/Trash";

const nullAddress = "0x0000000000000000000000000000000000000000"

class EthAddressList extends React.Component {

    static propTypes = {
		className: PropTypes.string,
		value: PropTypes.array,
		defaultValue: PropTypes.array,
		colors: PropTypes.bool,
		blocky: PropTypes.bool,
        allowZero: PropTypes.bool,
		blockySize: PropTypes.number,
		blockyScale: PropTypes.number,
		control: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func
	};

	static defaultProps = {
		className: 'eth-address-list',
        addresses: [],
		colors: true,
		control: false,
		allowZero: false,
		blocky: true,
		blockySize: 8,
		blockyScale: 4,
		disabled: false,
		onChange: () => { }
	};

    constructor(props) {
        super(props);
        this.state = { 
            addresses: [  { address:null, value:null, id: uuidv4() } ] 
        };
    }

    componentDidMount() {
        let addresses = [];
        if (this.props.addresses) {
            addresses = this.props.addresses.map(function (address) {
                return {
                    value: address,
                    address,
                    id: uuidv4() 
                }
            });
        }
        console.log(this.state.addresses);
        addresses = [...addresses, ...this.state.addresses];

        this.setState({ addresses });
    }
    
    setAddress(address, value, index) {
        const {addresses} = this.state;
        if(value && index == addresses.length-1){  
            addresses.push({ address:null, value:null, id: uuidv4() });
        }
        addresses[index] = { address, value };

        this.setState({ addresses });
    }

    removeAddress(index) {
        const {addresses} = this.state;
        addresses.splice(index,1)
        this.setState({ addresses });
    }


    render() {
        var list = this.state.addresses.map(
            (element, index, array) => {
                return(
                    <div className="d-flex" key={index}>
                        <EthAddress
                            control={true}
                            value={element.value}
                            allowZero={this.props.allowZero}    
                            onChange={(address, value) => {
                                this.setAddress(address, value, index);
                            }} />

                        <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={(event) => {
                                this.removeAddress(index)
                            }} className="btn-circle" ><TrashIcon width={15} /></Button>
                    </div>
                );
                }
        );
        return (
            <div>
                {list}
            </div>
        );
    }



}

export default EthAddressList;