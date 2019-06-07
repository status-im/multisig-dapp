import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import EthAddress from './EthAddress';
import uuidv4 from 'uuid/v4';
import TrashIcon from "./icon/Trash";

const nullAddress = "0x0000000000000000000000000000000000000000"

class EthAddressList extends React.Component {

    static propTypes = {
		className: PropTypes.string,
		values: PropTypes.array,
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
        values: [],
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
            values: [] ,
            addresses: []
        };
    }

    componentDidMount() {
        if (this.props.values) {
            this.setValues(this.props.values);
        }
    }

	componentDidUpdate(prevProps, prevState) {
        if (prevProps.values != this.props.values && this.props.values != this.state.values) {
            this.setValues(this.props.values);
        }
        if(prevState.addresses != this.state.addresses || prevState.values != this.state.values) {
			this.props.onChange(this.state.addresses,this.state.values);
		}
    }

    setValues(values) {
        const addresses = [...this.state.addresses, ...Array(values.length-this.state.addresses.length).fill(nullAddress)];
        this.setState({values, addresses});
    }
    
    setAddress(address, value, i) {
        const values = this.state.values.slice(0);
        const addresses = this.state.addresses.slice(0);
        values[i]=value;
        addresses[i]=address;
        this.setState({values,addresses});
    }

    removeAddress(i) {
        const values = this.state.values.filter((item, j) => i !== j);
        const addresses = this.state.addresses.filter((item, j) => i !== j);
        this.setState({values,addresses});
    }


    render() {
        const {values} = this.state;
        var list = values.map(
            (value, index, array) => {
                return(
                    <div className="d-flex" key={index}>
                        <EthAddress
                            control={true}
                            value={value}
                            allowZero={this.props.allowZero}
                            blocky={this.props.blocky}
                            colors={this.props.colors}  
                            onChange={(address, value) => {
                                this.setAddress(address, value, index);
                            }} />

                        <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={(event) => {
                                this.removeAddress(index)
                            }} className="btn-circle" ><TrashIcon/></Button>
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