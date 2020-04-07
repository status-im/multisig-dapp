import EmbarkJS from '../../embarkArtifacts/embarkjs';
import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import copy from 'copy-to-clipboard';
import './EthAddress.css';
import ClipIcon from "./icon/Clip";
import MoreIcon from "./icon/More";
import { HashLoader } from 'react-spinners';

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
		onChange: PropTypes.func,
		toolBarActions: PropTypes.arrayOf(PropTypes.object)
	};

	static defaultProps = {
		className: 'eth-address',
		value: "",
		defaultValue: "",
		colors: true,
		control: false,
		allowZero: true,
		blocky: true,
		blockySize: 8,
		blockyScale: 4,
		disabled: false,
		onChange: () => { },
		enableToolBar: true,
		ENSReverseLookup: true,
		toolBarActions: []
	};

	constructor(props) {
		super(props);
		this.controlRef = React.createRef();
		this.ref = React.createRef();
		this.state = {
			value: "",
			loaded: true,
			validAddress: false,
			address: null,
			acceptedOutput: false,
			ensReverse: null,
			menuVisible: false 
		};
	}


	componentDidMount() {
		this.setValue(this.props.value || this.props.defaultValue);
		document.addEventListener("mousedown", this.handleClickOutside);
	}
	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	handleClickOutside = event => {
		if (this.ref.current && !this.ref.current.contains(event.target)) {
		  	this.setState({
				menuVisible: false,
		  	});
		}
	};


	componentDidUpdate(prevProps, prevState) {
        if (prevProps.value != this.props.value) {
            this.setValue(this.props.value);
		}
		if(prevState.value != this.state.value) {
			this.loadAddressFromENS();	
		}
		if(prevState.address != this.state.address) {
			this.lookupENSReverseName();
		}
		if(prevState.loaded == false && this.state.loaded == true) {
			this.onChange();
		}
    }


	setValue(value){
		if(this.state.value == value) { 
			return;
		}
		value = value ? value : "";
		if(this.props.control && this.controlRef.current.textContent != value) {
			this.controlRef.current.textContent = value;
		}
		this.setState(
			{
				value, 
				address: nullAddress, 
				validAddress: false, 
				acceptedOutput: false,
				loaded: false, 
				ensReverse: null, 
				ensResolve: false 
			}
		);
		/*const validAddress = this.isValid(value);
		const address = validAddress ? value : nullAddress; 
		const acceptedOutput = validAddress && (this.props.allowZero || address != nullAddress);*/
	}

	isValid(value) {
		return /^(0x)?[0-9a-f]{40}$/i.test(value);
	}
	
	loadAddressFromENS() {
		const { value } = this.state;
		if(this.isValid(value)) {
			this.setState(
				{
					address: value, 
					validAddress: true, 
					acceptedOutput: (this.props.allowZero || value != nullAddress),
					loaded: false, 
					ensReverse: null, 
					ensResolve: false 
				}
			);
			return;
		}
		EmbarkJS.Names.resolve(value, (err, address) => {
			this.setState(err ? {
				address: nullAddress,
				ensResolve: false, 
				validAddress: false, 
				ensReverse: null,
				loaded: true,
				acceptedOutput: false
			} :	{
				address, 
				ensResolve: true, 
				validAddress: true,
				ensReverse: null,
				loaded: false,
				acceptedOutput:	address != nullAddress
			});
		});
	
	}

	lookupENSReverseName() {
		const { address, validAddress } = this.state;
		if(this.props.ENSReverseLookup && validAddress){
			EmbarkJS.Names.lookup(address, (err, name) => {
				this.setState({ensReverse: name, loaded: true});
			})
		} else {
			this.setState({ensReverse: null, loaded: true});
		}
	}	
	
	onChange() {
		const { address, value, ensReverse } = this.state;
		this.props.onChange(address, value, ensReverse);
	}

	onClick = () => {
		const { menuVisible, } = this.state
		this.setState({ menuVisible: !menuVisible });
	}
	
	copyAddress = () => {
		copy(this.state.address);
		this.setState({ menuVisible: false })	
	}
	copyValue = () => {
		copy(this.state.value);
		this.setState({ menuVisible: false })	
	}
	copyLookup = () => {
		copy(this.state.ensReverse);
		this.setState({ menuVisible: false })	
	}



	onBlur(event) {
		this.setValue(this.controlRef.current.textContent);
	}
    onKeyPress(event) {
        if (event.charCode === 13) {
			event.preventDefault();
			this.setValue(this.controlRef.current.textContent);
        }
    }

    onKeyUp(event) {
		clearTimeout(this.keyWait);
		if(this.controlRef.current.textContent){
			this.keyWait = setTimeout(() => { this.setValue(this.controlRef.current.textContent)}, 1000);
		}
	}

    handlePaste(event) {
		event.stopPropagation();
		event.preventDefault();
		var clipboardData, pastedData;
        clipboardData = event.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text');
		this.controlRef.current.textContent = pastedData;
		this.setValue(pastedData);
    }

    focus() {
        this.controlRef.current.focus();
	}
	

	getBackgroundGradient(address) {
		return `linear-gradient(90deg, #${address.substr(2, 6)} 0% 14%, #${address.substr(8, 6)} 14% 28%, #${address.substr(14, 6)} 28% 42%, #${address.substr(19, 6)} 43% 57%, #${address.substr(24, 6)} 58% 72%, #${address.substr(30, 6)} 72% 86%, #${address.substr(36, 6)} 86% 100%)`
	}

	
	render() {
		const {
			disabled,
			className,
			colors,
			blocky,
			blockySize,
			blockyScale,
			control,
			enableToolBar,
			toolBarActions
		} = this.props;
		const { menuVisible,  ensReverse, value, validAddress, loaded, acceptedOutput, ensResolve} = this.state;
		const address = validAddress ? this.state.address : nullAddress; 
		const colorStyle = colors ? {
			backgroundImage: this.getBackgroundGradient(address)
		} : {}
		return (	
			<span ref={this.ref} style={colorStyle} className={`${className}`} >
				<span className={(acceptedOutput) ? "bg" : "err"}>
					{blocky &&	 
						<Blockies className="blocky" seed={address.toLowerCase()} size={blockySize} scale={blockyScale} />
					}
					<span className={control ? "indicator" : "text" } >
						{ensReverse && 
						<span className="ens-reverse">
							<small>{ensReverse}</small>
						</span>}
						<span className="hex"> 
							<strong>{address.substr(0, 6)}</strong><small>{address.substr(6, 36)}</small><strong>{address.substr(36, 6)}</strong>
						</span>
					</span>
					{ control && 
					<span 
						className="control hex"
						ref={this.controlRef} 
						placeholder={nullAddress}
						onKeyPress={(event) => this.onKeyPress(event)} 
						onKeyUp={(event) => this.onKeyUp(event)}
						onPaste={(event) => this.handlePaste(event)}
						onBlur={(event) => this.onBlur(event)}
						contentEditable={!disabled} 
						/>
					}
					{((enableToolBar) || (toolBarActions && toolBarActions.length > 0)) && (loaded ? 
					<span className="more-icon" onClick={this.onClick}>
						<MoreIcon fill="#000" width={15} /> 
					</span> : 
					<span className="loading" onClick={this.onClick}>
						<HashLoader loading={!loaded} sizeUnit={"px"} size={15}/> 
					</span>)}
				</span>
				{ menuVisible && <nav className="menu text-left">
						{ toolBarActions.map((value, index) => {
							return (<a key={index} onClick={value.action}> {value.text} </a>) 
						})}
						
						{ enableToolBar && acceptedOutput && <a onClick={this.copyAddress}><ClipIcon /> Copy address </a> }
						{ enableToolBar && ensReverse && <a onClick={this.copyLookup}><ClipIcon /> Copy ENS name </a> }
						{ enableToolBar && (!acceptedOutput || (address != value && ensReverse != value)) && <a onClick={this.copyValue}><ClipIcon /> Copy input value </a> }
					</nav> }			
			</span>
		)
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}}

export default EthAddress;
