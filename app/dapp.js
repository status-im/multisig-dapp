import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from '../embarkArtifacts/embarkjs';
import MultiSigWallet from 'Embark/contracts/MultiSigWallet';
import ContractLoader from './components/multisigwallet/loader';
import MSWDeployer from './components/multisigwallet/deployer';
import { HashRouter, Route, Redirect, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import './dapp.css';
import { Navbar, Nav, Alert, NavDropdown } from 'react-bootstrap';
import ColorEthAddress from './components/color-eth-address';
import MSWTransactionTable from './components/multisigwallet/transaction-table';
import MSWOwnerTable from './components/multisigwallet/owner-table';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            strError: null,
            activeKey: 1,
            blockchainEnabled: false,
            MultiSigWallet: null,
            account: null,
            isOwner: false,
        };
        this.setContractAddress = this.setContractAddress.bind(this);
        this.setMSWInstance = this.setMSWInstance.bind(this);
    }

    componentDidMount() {
        //this.enableEthereum();
        EmbarkJS.onReady((err) => {
            if (err) {
                // If err is not null then it means something went wrong connecting to ethereum
                // you can use this to ask the user to enable metamask for e.g
                return this.setState({ strError: err.message || err });
            }
            this.setState({ account: web3.eth.defaultAccount, blockchainEnabled: true })
        });

    }
    ///:address/transactions
    routes() {
        return [
            {
                path: "/:address",
                exact: true,
                sidebar: () => <div>home!</div>,
                main: () => <h2>Home</h2>
            },
            {
                path: "/:address/transactions",
                sidebar: () => <div>bubblegum!</div>,
                main: () => <h2>Bubblegum</h2>
            },
            {
                path: "/:address/owners",
                sidebar: () => <div>shoelaces!</div>,
                main: () => <h2>Shoelaces</h2>
            }
        ]
    }

    setContractAddress(address) {
        console.log("setContractAddress", address);
        try {
            let checksumAddress = web3.utils.toChecksumAddress(address);
            this.checkContractAddress(checksumAddress);
        } catch (error) {
            this.setState({ strError: error.toString() })
        }

    }

    async checkContractAddress(checksumAddress) {
        this.setState({ strError: null });
        try {
            let code = await web3.eth.getCode(checksumAddress);
            if (code.length > 2) {
                this.setMSWInstance(new EmbarkJS.Blockchain.Contract({ abi: MultiSigWallet._jsonInterface, address: checksumAddress }))
            } else {
                this.setState({ strError: "Address don't have any code. Might be wrong address, wrong network, or unsynced network." })
            }
        } catch (error) {
            this.setState({ strError: error.toString() })
        }
    }

    async setMSWInstance(MultiSigWallet) {
        try {
            let req = await MultiSigWallet.methods.required().call(); //catch not multisig eallrt
            if (req > 0) {
                var isOwner = false;
                try {
                    if (this.state.account) {
                        isOwner = await MultiSigWallet.methods.isOwner(this.state.account).call()
                    }
                } catch (error) {
                    this.setState({ strError: error.toString() })
                }
                this.setState({ MultiSigWallet: MultiSigWallet, isOwner: isOwner });
            } else {
                this.setState({ strError: "Invalid MultiSigWallet" })
            }
        } catch (error) {
            this.setState({ strError: "Not a Multisig Wallet" })
        }
    }


    navBar(contractAddress) {
        return (<Navbar expand="sm" bg="light" variant="light">
            <Navbar.Brand><LinkContainer to={"/" + (contractAddress ? contractAddress : "")}><Nav.Link>MultiSigWallet</Nav.Link></LinkContainer></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                {contractAddress ?
                    <Nav className="mr-auto">
                        <NavDropdown title="Transactions" id="nav-dropdown">
                            <NavDropdown.Item as="div"><LinkContainer to={"/" + contractAddress + "/transactions"}><Nav.Link>All</Nav.Link></LinkContainer></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as="div"><LinkContainer to={"/" + contractAddress + "/transactions/pending"}><Nav.Link>Pending</Nav.Link></LinkContainer></NavDropdown.Item>
                            <NavDropdown.Item as="div"><LinkContainer to={"/" + contractAddress + "/transactions/executed"}><Nav.Link>Executed</Nav.Link></LinkContainer></NavDropdown.Item>
                        </NavDropdown>
                        <LinkContainer to={"/" + contractAddress + "/owners"}><Nav.Link>Owners</Nav.Link></LinkContainer>
                    </Nav> :
                    <Nav />
                }
                <Navbar.Text>
                    <ColorEthAddress blockyScale={4} address={this.state.MultiSigWallet ? this.state.MultiSigWallet._address : this.state.account} />
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>);
    }

    render() {
        if (!this.state.blockchainEnabled) {
            return (
                <div>Waiting for blockchain.</div>
            )
        }
        return (
            <HashRouter hashType="noslash">
                {this.state.strError != null && <Alert variant="danger">{this.state.strError}</Alert>}
                {this.state.isOwner && this.state.execWarn && <Alert onClose={() => { this.setState({ execWarn: false }) }} variant="warning">Warning: You are legally responsable by what you approve. Only approve when you are sure the execution is desired.</Alert>}

                <Route path="/:address?" render={({ match }) => (
                    <React.Fragment>
                        {this.navBar(match.params.address)}
                        {this.state.MultiSigWallet ?
                            <React.Fragment /> :
                            <React.Fragment>
                                <ContractLoader account={this.state.account} address={match.params.address} onReady={this.setContractAddress.bind(this)} />
                                <MSWDeployer account={this.state.account} onDeploy={this.setMSWInstance} />
                            </React.Fragment>}
                    </React.Fragment>
                )} />
                <Route exact path="/:address?" render={({ match }) => (
                    this.state.MultiSigWallet ?
                        <Redirect to={"/" + this.state.MultiSigWallet.options.address + "/transactions/pending"} /> :
                        <React.Fragment />
                )} />
                <Route path="/:address/transactions/:mode?" render={({ match }) => (
                    this.state.MultiSigWallet && <MSWTransactionTable mode={match.params.mode} MultiSigWallet={this.state.MultiSigWallet} account={this.state.account} isOwner={this.state.isOwner} />
                )} />
                <Route path="/:address/owners" render={({ match }) => (
                    this.state.MultiSigWallet && <MSWOwnerTable MultiSigWallet={this.state.MultiSigWallet} account={this.state.account} isOwner={this.state.isOwner} />
                )} />


            </HashRouter>
        );
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
