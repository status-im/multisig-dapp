import React from 'react';
import { InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import './color-address-input.css'

class ColorAddressInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.defaultValue
        };
        this.ref = React.createRef();
    }

    static propTypes = {
        className: PropTypes.string,
        defaultValue: PropTypes.string,
        disabled: PropTypes.bool,
        placeholder: PropTypes.string,
        colors: PropTypes.bool,
        blocky: PropTypes.bool,
        blockySize: PropTypes.number,
        blockyScale: PropTypes.number,
        onChange: PropTypes.func
    };

    static defaultProps = {
        className: 'text-monospace',
        defaultValue: "0x0000000000000000000000000000000000000000",
        placeholder: "address",
        disabled: false,
        colors: true,
        blocky: true,
        blockySize: 8,
        blockyScale: 4,
        onChange: () => { }
    };

    componentDidMount() {
        this.ref.current.textContent = this.state.address;
    }

    handleChange(e) {
        console.log("handleChange", e);
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
            className,
            colors,
            blocky,
            blockySize,
            blockyScale,
            placeholder,
            disabled
        } = this.props;
        const { address } = this.state;
        const colorStyle = colors ? {
            backgroundImage: `linear-gradient(90deg, #${address.substr(6, 6)} 0% 15%, #${address.substr(12, 6)} 17% 32%, #${address.substr(18, 6)} 34% 49%, #${address.substr(24, 6)} 51% 66%, #${address.substr(30, 6)} 68% 83%, #${address.substr(36, 6)} 85% 100%)`
        } : {}
        return (
            <div className={className + " color-address-control"}>
                <div style={colorStyle} className={("address-control" + (disabled ? " disabled" : " enabled"))}>
                    <InputGroup>
                        {blocky && <InputGroup.Prepend>
                            <InputGroup.Text id="blocky"><Blockies size={blockySize} scale={blockyScale} seed={address.toLowerCase()} /></InputGroup.Text>
                        </InputGroup.Prepend>}
                        <div className="address-input">
                            <div className="form-control" onChange={(e) => this.handleChange(e)} onKeyPress={(event) => this.onKeyPress(event)} onKeyUp={(event) => this.onKeyUp(event)}
                                ref={this.ref} contentEditable={!disabled} placeholder={placeholder} onPaste={(event) => this.handlePaste(event)} />
                        </div>
                        <div className="address-text">
                            {address ? (
                                <React.Fragment>
                                    <strong>{address.substr(0, 6)}</strong><small>{address.substr(6, 36)}</small> <strong>{address.substr(36, 6)}</strong>
                                </React.Fragment>) : 
                                (<span className="text-secondary">{placeholder}</span>)}
                        </div>
                    </InputGroup>
                </div>
            </div>
        );
    }
}

export default ColorAddressInput;