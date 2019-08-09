import React from 'react';
import PropTypes from 'prop-types';
import EthAddress from './EthAddress';
import './EthAddressList.css';
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
        allowAdd: PropTypes.bool,
        allowRemove: PropTypes.bool,
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
        allowAdd: true,
        allowRemove: true,
		onChange: () => { }
	};

    constructor(props) {
        super(props);
        this.state = { 
            values: [] ,
            newItem: "",
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

    newItem(address, value) {
        const values = this.state.values.slice(0);
        const addresses = this.state.addresses.slice(0);
        values.push(value);
        addresses.push(address);
        this.setState({values, addresses, newItem: ''});
    }

    removeAddress(i) {
        const values = this.state.values.filter((item, j) => i !== j);
        const addresses = this.state.addresses.filter((item, j) => i !== j);
        this.setState({values,addresses});
    }


    render() {
        const {values, newItem} = this.state;
        const {control, disabled, allowZero, blocky, blockySize, blockyScale, colors, allowAdd, allowRemove} = this.props;
        var list = values.map(
            (value, index, array) => {
                return(
                    <div className="d-flex" key={index}>
                        <EthAddress
                            control={control}
                            value={value}
                            allowZero={allowZero}
                            disabled={disabled}
                            blocky={blocky}
                            blockySize={blockySize}
                            blockyScale={blockyScale}
                            colors={colors}  
                            toolBarActions={
                                (control && allowRemove) ? [
                                    {
                                        action: (event) => { this.removeAddress(index)},
                                        text: (<><TrashIcon/> Remove</>) 
                                    }
                                ] : [] }
                            onChange={(address, value) => {
                                this.setAddress(address, value, index);
                            }} />
                    </div>
                );
                }
        );
        return (
            <div className="eth-address-list">
                {list}
                {control && !disabled && allowAdd && <div className="d-flex new-item">
                    <EthAddress
                        control={true}
                        enableToolBar={false}
                        ENSReverseLookup={false}
                        value={newItem}
                        allowZero={allowZero}
                        blocky={blocky}
                        blockySize={blockySize}
                        blockyScale={blockyScale}
                        colors={colors}  
                        onChange={async (address, value) => {
                            await this.setState({newItem: value});
                            if(address != nullAddress){
                                this.newItem(address, value);
                            }
                        }} />
                    </div>}
            </div>
        );
    }



}

export default EthAddressList;