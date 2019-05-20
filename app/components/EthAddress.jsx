import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import { Overlay, Tooltip } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import './EthAddress.css';

const nullAddress = "0x0000000000000000000000000000000000000000"
class EthAddress extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		address: PropTypes.string,
		defaultValue: PropTypes.string,
		colors: PropTypes.bool,
		blocky: PropTypes.bool,
		blockySize: PropTypes.number,
		blockyScale: PropTypes.number,
		control: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func
	};

	static defaultProps = {
		className: 'eth-address',
		defaultValue: nullAddress,
		colors: true,
		control: false,
		allowZero: true,
		blocky: true,
		blockySize: 8,
		blockyScale: 4,
		disabled: false,
		onChange: () => { }
	};

	constructor(props) {
		super(props);
		this.controlRef = React.createRef();
		this.attachRef = containerRef => this.setState({ containerRef });
		this.state = {
			address: props.address != undefined ? props.address : props.defaultValue,
			tooltipVisible: false 
		};
	}


	componentDidMount() {

    }

	componentDidUpdate(prevProps, prevState) {
        if (prevProps.value != this.props.value && this.props.value != this.state.value) {
            this.setState({value: this.props.value});
		}
		if(prevState.value != this.state.value) {
			this.checkValue(this.state.value);	
		}
		if(prevState.address != this.state.address) {
			this.checkAddress(this.state.address);
			this.props.onChange(this.state.address);
		}
    }

	checkAddress(address) {
		if(address != nullAddress){
			EmbarkJS.Names.lookup(address, (err, name) => {
				if(err){
					console.log("lookup ERR ", address, err, name);
				} else {
					console.log("the domain of "+address+" is: " + name);
				}
				this.setState({ensReverse: name});
			})
		} else {
			this.setState({ensReverse: null});
		}

	}

	checkValue(value) {
		console.log("value is" + value)
		if(value == null){
			this.setState({address: nullAddress, valid: this.props.allowZero});
		}else if(value.startsWith("0x")) {
			const valid = /^(0x)?[0-9a-f]{40}$/i.test(value);
			if (valid) {
				this.setState({address: value, valid});
			} else {
				this.setState({address: nullAddress, valid});
			}
		} else {
			EmbarkJS.Names.resolve(value, (err, result) => {
				if(err){
					console.log('ENS err', value, err, result)
					this.setState({address: nullAddress, valid: false});
				} else {
					console.log("ENS address of "+value+" is " + result)
					const valid = !err && result != nullAddress;
					this.setState({address: result, valid});	
				}
			});
		}
	}
	onClick = () => {
		if (!this.props.control) {
			copy(this.state.address);
			this.setState({ tooltipText: "Copied", tooltipVisible: true });
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => { this.setState({ tooltipVisible: false }) }, 1000)
		}
	}
	
    onKeyPress(event) {
        if (event.charCode === 13) {
            event.preventDefault();
        }
    }

    onKeyUp(event) {
		let text = this.controlRef.current.textContent;
		this.setState({ value: text });
	}

    handlePaste(event) {
        let text = this.controlRef.current.textContent;
		this.setState({ value: text });
    }

    focus() {
        this.controlRef.current.focus();
	}
	
	render() {
		const {
			disabled,
			className,
			colors,
			blocky,
			blockySize,
			blockyScale,
			control
		} = this.props;
		const { ensReverse, value, valid, address } = this.state;
		const { containerRef, tooltipVisible, tooltipText } = this.state;
		const colorStyle = colors ? {
			backgroundImage: `linear-gradient(90deg, #${address.substr(6, 6)} 0% 15%, #${address.substr(12, 6)} 17% 32%, #${address.substr(18, 6)} 34% 49%, #${address.substr(24, 6)} 51% 66%, #${address.substr(30, 6)} 68% 83%, #${address.substr(36, 6)} 85% 100%)`
		} : {}
		return (
			<span ref={this.attachRef} style={colorStyle} onClick={this.onClick} className={`${className} ${valid ? '': 'err' }`} >
				<span className={valid ? "bg" : "err"}>
					{blocky && valid &&	 
						<span className="blocky">
							<Blockies seed={address.toLowerCase()} size={blockySize} scale={blockyScale} />
						</span>}
					<span className={control ? "indicator" : "text" } >
						{ensReverse && 
						<span className="ens-reverse">
							<small>{ensReverse}</small>
						</span>}
						<span> 
							<strong>{address.substr(0, 6)}</strong><small>{address.substr(6, 36)}</small><strong>{address.substr(36, 6)}</strong>
						</span>
					</span>
					{ control ? 
					<span 
						className="control"
						ref={this.controlRef} 
						placeholder={nullAddress}
						onKeyPress={(event) => this.onKeyPress(event)} 
						onKeyUp={(event) => this.onKeyUp(event)}
						onPaste={(event) => this.handlePaste(event)}
						contentEditable={!disabled} 
						/>
					: 
					<span className="clip-icon">
						<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 20 20" width="15" height="15">
							<path d="M4.317,16.411c-1.423-1.423-1.423-3.737,0-5.16l8.075-7.984c0.994-0.996,2.613-0.996,3.611,0.001C17,4.264,17,5.884,16.004,6.88l-8.075,7.984c-0.568,0.568-1.493,0.569-2.063-0.001c-0.569-0.569-0.569-1.495,0-2.064L9.93,8.828c0.145-0.141,0.376-0.139,0.517,0.005c0.141,0.144,0.139,0.375-0.006,0.516l-4.062,3.968c-0.282,0.282-0.282,0.745,0.003,1.03c0.285,0.284,0.747,0.284,1.032,0l8.074-7.985c0.711-0.71,0.711-1.868-0.002-2.579c-0.711-0.712-1.867-0.712-2.58,0l-8.074,7.984c-1.137,1.137-1.137,2.988,0.001,4.127c1.14,1.14,2.989,1.14,4.129,0l6.989-6.896c0.143-0.142,0.375-0.14,0.516,0.003c0.143,0.143,0.141,0.374-0.002,0.516l-6.988,6.895C8.054,17.836,5.743,17.836,4.317,16.411"></path>
						</svg>
					</span> 
					}
					<Overlay target={containerRef} show={tooltipVisible} placement="bottom">
						{(props) => {
							delete props['show'];
							return (
								<Tooltip id="address-tooltip" {...props} >{tooltipText}</Tooltip>
							)
						}}
					</Overlay>
				</span>
			</span>		
		)
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}}

export default EthAddress;
