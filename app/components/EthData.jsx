import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Dropdown from 'react-dropdown';
import "react-tabs/style/react-tabs.css";
import HexData from './HexData';
import EthAddress from './EthAddress';
import './EthData.css';

class EthData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sig: "",
            arg: "",
            method: null,
            params: [],
            methods: [],
        };
    }

    static propTypes = {
        control: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onError: PropTypes.func,
        value: PropTypes.string,
        abi: PropTypes.array
    }

    static defaultProps = {
        onChange: ()=>{},
        onError: ()=>{},
        control: false,
        value: "0x",
        abi: []
    }

    componentDidMount(){
        const {sig, arg} = this.decodeValue(this.props.value || this.props.defaultValue);
        const methods = this.processABI(this.props.abi);
        const method = this.findMethod(methods, sig)
        const params = this.decodeArgs(method, arg);
        this.setState({sig, arg, methods, method, params});
    }

    componentDidUpdate(prevProps, prevState){
        const {value, abi} = this.props;
        var {sig, arg, methods, method, params} = this.state;
        var updated = false;
        if (prevProps.value != value) {
            const decoded = this.decodeValue(value);
            sig = decoded.sig;
            arg = decoded.arg;
            updated = true;
        }
        if (prevProps.abi != abi) {
            methods = this.processABI(abi)
            updated = true;
        }
        if(prevState.sig != sig || prevState.methods != methods) {
            method = this.findMethod(methods, sig);
            updated = true;
        }
        if(prevState.arg != arg || prevState.method != method){
            params = this.decodeArgs(method, arg);
            updated = true;
        }
        if(updated){
            this.setState({sig, arg, methods, method, params});
        }
        
        if(prevState.params != params || prevState.method != method){
            this.onUpdate(sig, params, method);
        }
    }

    decodeValue(value) {
        const sig = value.substr(2, 8);
        const arg = value.substr(10);
        return {sig, arg}
    }

    processABI(abi){
        if(!abi) return;
        var methods = [];
        try {
            methods = JSON.parse(abi).filter(method => method.type == 'function' && !method.constant).map((method) => {
                method.value = web3.eth.abi.encodeFunctionSignature(method).substr(2);
                method.label = method.name;  
                return method;
            });
        } catch(e) {
            console.error(e)
            this.props.onError(e);
        }
        return methods;
    }

    findMethod(methods, sig) {
        for(var i = 0; i < methods.length; i++) {
            if(methods[i].value == sig){
                return methods[i];
            }
        }
        return null;
    }

    decodeArgs(method, arg) {
        if(method && arg){
            var params = [];
            var decoded;
            try {
                decoded = web3.eth.abi.decodeParameters(method.inputs.map((v) => {return(v.type)}), arg);
            } catch(e) {
                decoded = method.inputs.map((input) => {
                    
                    const type = input.type;
                    var defVal = "";
                    if(type.startsWith("uint") || type.startsWith("int")){
                        defVal = "0";
                    } else {
                        switch(type) {
                            case "address": 
                                defVal = "0x0000000000000000000000000000000000000000";
                                break;
                            case "bytes":
                                defVal = "0x0";
                                break;            
                            default: 
                                defVal = "";
                                break;
                        }
                    }
                    return defVal;
                });
                this.props.onError(e);
            } 
            for(var i = 0; i < method.inputs.length; i++) {
                params[i] = decoded[i];
            }

            return params;
        }
    }
    
    onUpdateMethod(method) {
        const sig = method.value;
        this.setState({sig});
    }

    onUpdateAddressInput(i, data, userInput) {
        var params = Object.assign([], this.state.params);
        params[i] = data;
        this.setState({params});
    }

    onUpdateInput(i,type,e){
        var value = ""+e.target.value;
        switch (type) {

            case "bytes":
                if(value.indexOf("0x") != 0) {
                    value = "0x"+value;
                }
                break;
        }
        try{
            web3.eth.abi.encodeParameter(type,value)
            var params = Object.assign([], this.state.params);
            params[i] = value;
            this.setState({params});
        }catch(e){
            console.error(e)
        }

    }

    onUpdate(sig, params, method){

        if(!params || !method){
            return;
        }
        var encoded = "0x";
        try{
            encoded = web3.eth.abi.encodeParameters(method.inputs.map((v) => {return(v.type)}), params);
        }catch(e){
            this.props.onError(e);
        }finally{
            const arg = encoded.substr(2);
            const value = sig + arg ;
            this.props.onChange(value, {method, params} )
            this.setState({arg});
        }
        
    }




    
    render() {
        console.log(this.state)
        const {control, disabled, abi, value} = this.props; 
        const {sig, arg, methods, method, params} = this.state; 
   
        return (
            <div className="eth-calldata">
                <Tabs>
                    <TabList>
                        <Tab>ABI form</Tab>
                        <Tab>Hex editor</Tab>
                        <Tab>Options</Tab>
                    </TabList>
                    <TabPanel>
                        <Dropdown disabled={!control || disabled} options={methods} onChange={(method) => this.onUpdateMethod(method)} value={sig} placeholder="Select method"/>
                        <ul>
                        {method && method.inputs.map((v, i) => {
                            const value = params? params[i] : "";
                            var display;
                            switch (v.type) {
                                case "address": 
                                    display = (<EthAddress onChange={this.onUpdateAddressInput.bind(this,i)} value={value} control={control} disabled={disabled} />)
                                    break;
                                case "uint256":
                                    display = (<input type="number" onChange={this.onUpdateInput.bind(this,i,v.type)} value={value} disabled={disabled} />)
                                    break;
                                case "bytes":
                                default:
                                    display = (<textarea onChange={this.onUpdateInput.bind(this,i, v.type)} value={value} disabled={disabled} />)
                                    break;
                            }
                            return(<li key={i}><small>{v.name} ({v.type}): </small>{display}</li>)
                        })}
                        </ul>
                    </TabPanel>
                    <TabPanel>
                        {sig && <div className="eth-sig"><div className="sig-head">[sig]:</div><HexData control={control} disabled={disabled} buffer={Buffer.from(sig, "hex")} rowLength={6} setLength={6} nohead={true} /></div>}
                        {arg && <HexData control={control} disabled={disabled} buffer={Buffer.from(arg, "hex")} rowLength={32} setLength={4} />} 
                    </TabPanel>
                    <TabPanel>
                        <h2>Set ABI</h2>
                        <textarea
                            value={abi}
                            placeholder="[]"
                            onChange={(event) => this.setABI(event.target.value) } /> 
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

export default EthData;