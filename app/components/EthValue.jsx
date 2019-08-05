import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './EthValue.css';

class EthValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '0',
            unit: 'wei',
            dot: false,
            error: null
        };
    }

    static propTypes = {
        control: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onError: PropTypes.func,
        value: PropTypes.string,
        unit: PropTypes.string,

    }

    static defaultProps = {
        control: false,
        disabled: false,
        value: '0',
        unit: 'wei',
        onChange: () => {},
        onError: () => {}
    }

    componentDidMount(){
		this.setValue(this.props.value || this.props.defaultValue);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.value != this.props.value && this.props.value != this.state.value) {
            this.setValue(this.props.value);
        }
        
        if (prevProps.unit != this.props.unit) {
            this.setUnit(this.props.unit);
		}
    }
    
    setValue(newValue) {
        const { unit } = this.state;
        var value = "0", dot = false, error = null;
        try {
            if (newValue) {
                dot = newValue.endsWith('.') || newValue.endsWith(',');
                value = web3.utils.toWei(newValue, unit);
            }
        } catch (e) {
            error = e;
        }
        this.setState({ value, dot, error});
        this.props.onChange(value, error);
    }

    setUnit(unit) {
        this.setState({ unit });
    }

    render() {
        const units = ['ether', 'finney', 'szabo', 'gwei', 'wei']
        const { value, unit, dot } = this.state;
        const { control, disabled } = this.props;  
        const renderValue = web3.utils.fromWei(value, unit).toString() + (dot ? '.' : '');
        return (
            <div className="eth-value">
                {control ? <input
                    type="text"
                    value={renderValue}
                    placeholder="value (uint256)"
                    disabled={disabled}
                    onChange={(event) => this.setValue(event.target.value) }
                /> : <p>{renderValue}</p> }
                <Dropdown options={units} onChange={(option) => this.setUnit(option.value)} value={unit} placeholder="Select unit"/>
            </div>
        )
    }
}

export default EthValue;