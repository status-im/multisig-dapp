import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import './EthAddress.css';

class EthAddressControl extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		defaultValue: PropTypes.string,
		colors: PropTypes.bool,
		blocky: PropTypes.bool,
		blockySize: PropTypes.number,
		blockyScale: PropTypes.number,
		disabled: PropTypes.bool,
		onChange: PropTypes.func
	};

	static defaultProps = {
		className: 'text-monospace',
		defaultValue: "0x0000000000000000000000000000000000000000",
		colors: true,
		blocky: true,
		blockySize: 8,
		blockyScale: 4,
		disabled: false,
		onChange: () => { }
	};

	constructor(props) {
		super(props);
		this.ref = React.createRef();
		this.state = { address: props.defaultValue };
	}


	componentDidMount() {
        this.ref.current.textContent = this.state.address;
    }


    onKeyPress(event) {
        if (event.charCode === 13) {
            event.preventDefault();
        }
    }

    onKeyUp(event) {
        let text = this.ref.current.textContent;
        this.setState({ address: text });
        this.props.onChange(text);
    }

    handlePaste(event) {
        var clipboardData, pastedData;
        clipboardData = event.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        if (/^(0x)?[0-9a-f]{40}$/i.test(pastedData)) {
            event.stopPropagation();
            event.preventDefault();
            this.ref.current.textContent = pastedData;
            this.setState({ address: pastedData });
            this.props.onChange(pastedData);
        }
    }

    focus() {
        this.ref.current.focus();
	}

	render() {
		const {
			disabled,
			className,
			colors,
			blocky,
			blockySize,
			blockyScale,
			defaultValue
		} = this.props;
		const address = !this.state.address ? defaultValue : this.state.address.startsWith('0x') ? this.state.address : `0x${this.state.address}`;
		const colorStyle = colors ? {
			backgroundImage: `linear-gradient(90deg, #${address.substr(6, 6)} 0% 15%, #${address.substr(12, 6)} 17% 32%, #${address.substr(18, 6)} 34% 49%, #${address.substr(24, 6)} 51% 66%, #${address.substr(30, 6)} 68% 83%, #${address.substr(36, 6)} 85% 100%)`
		} : {}
		return (
			<span style={colorStyle} className={`${className} eth-address`} >
				<span className="address-bg">
					{blocky &&
						<span className="blocky">
							<Blockies seed={address.toLowerCase()} size={blockySize} scale={blockyScale} />
						</span>}
					<span className="address-indicator" >
						<strong>{address.substr(0, 6)}</strong><small>{address.substr(6, 36)}</small><strong>{address.substr(36, 6)}</strong>
					</span>
					<span 
						className="address-control"
						ref={this.ref} 
						onKeyPress={(event) => this.onKeyPress(event)} 
						onKeyUp={(event) => this.onKeyUp(event)}
						onPaste={(event) => this.handlePaste(event)}
						contentEditable={!disabled} 
						/>
				</span>
			</span>
		)
	}
	
	componentWillUnmount() {
		clearTimeout(this.timeout);
	}
}

export default EthAddressControl;
