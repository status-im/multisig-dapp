import React from 'react';
import EthAddress from './EthAddress';
import EthValue from './EthValue';
import EthData from './EthData';
import PropTypes from 'prop-types';
import './EthCall.css';

class EthCall extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static propTypes = {
        control: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onError: PropTypes.func,
        value: PropTypes.object,
    }

    static defaultProps = {
        control: false,
        disabled: false,
        onError: () => {},
        onChange: () => {},
        tx: { value: 0, data: "0x", to: "0x0000000000000000000000000000000000000000"},
        abi: null
    }


    componentDidMount() {

    }


    componentDidUpdate(prevProps, prevState) {

    }


    render() {
        const {control, disabled, abi, tx} = this.props;
        return (<div className="eth-call">
            <ul>
                <li>
                    <small className="text-secondary">Destination:</small>
                    <EthAddress 
                        control={control} 
                        disabled={disabled} 
                        blockyScale={4} 
                        value={tx.to} />
                </li>
                <li>
                    <small className="text-secondary">Value:</small>
                    <EthValue 
                        control={control} 
                        disabled={disabled} 
                        value={tx.value} />
                </li>
                <li>
                    <small className="text-secondary">Data:</small>
                    <EthData 
                        control={control} 
                        disabled={disabled} 
                        value={tx.data} 
                        abi={abi} />
                </li>
            </ul>
        </div>)

    }
}

export default EthCall;