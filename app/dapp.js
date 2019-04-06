import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from '../embarkArtifacts/embarkjs';
import MSWUI from './components/multisigwallet';
import MSWLoader from './components/multisigwallet/loader';
import MSWDeployer from './components/multisigwallet/deployer';
import { HashRouter, Route, Redirect } from "react-router-dom";
import './dapp.css';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            activeKey: 1,
            blockchainEnabled: false,
            mswInstance: null,
            account: null,
            isOwner: false,
        };
        this.onMultiSigReady = this.onMultiSigReady.bind(this);
    }

    componentDidMount() {
        //this.enableEthereum();
        EmbarkJS.onReady((err) => {
            if (err) {
                // If err is not null then it means something went wrong connecting to ethereum
                // you can use this to ask the user to enable metamask for e.g
                return this.setState({ error: err.message || err });
            } else if(!this.state.account) {
                this.setState({ account: web3.eth.defaultAccount, blockchainEnabled: true })
            }
        });

    }

    
    onMultiSigReady(instance, isOwner) {
        this.setState({ isOwner: isOwner, mswInstance: instance });
    }

    render() {
        if (!this.state.blockchainEnabled) {
            return (
                <div>Waiting for blockchain.</div>
            )
        }
        if (this.state.error) {
            return (<div>
                <div>Something went wrong connecting to ethereum. Please make sure you have a node running or are using metamask to connect to the ethereum network:</div>
                <div>{this.state.error}</div>
            </div>);
        }
        if (!this.state.mswInstance) {
            return (
                <HashRouter hashType="noslash">
                    <Route exact path="/" render={() => (
                        <MSWLoader account={this.state.account} onReady={this.onMultiSigReady} />
                    )} />
                    <Route path="/wallet/:address" render={({ match }) => (
                        <MSWLoader account={this.state.account} address={match.params.address} onReady={this.onMultiSigReady} />
                    )} />
                    <MSWDeployer account={this.state.account} onDeploy={this.onMultiSigReady}/>
                </HashRouter>
            );
        } else {
            return (
                <HashRouter hashType="noslash">
                    <Route exact path="/" render={() => (
                        <Redirect to={"/wallet/" + this.state.mswInstance._address} />
                    )} />
                    <Route path="/wallet/:address" render={(props) => (
                        props.match.params.address != this.state.mswInstance._address && <Redirect to={"/wallet/" + this.state.mswInstance._address} />
                    )} />
                    <MSWUI instance={this.state.mswInstance} account={this.state.account} isOwner={this.state.isOwner} />
                </HashRouter>
            );

        }

    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
