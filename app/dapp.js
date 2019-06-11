import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from '../embarkArtifacts/embarkjs';
import MultiSigWallet from '../embarkArtifacts/contracts/MultiSigWallet';
import ContractLoader from './components/multisigwallet/loader';
import MSWDeployer from './components/multisigwallet/deployer';
import { HashRouter, Route, Redirect, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import './dapp.css';
import { Navbar, Nav, Alert, NavDropdown, Container, CardColumns } from 'react-bootstrap';
import EthAddress from './components/EthAddress';
import MSWTransactionTable from './components/multisigwallet/transaction-table';
import MSWOwnerTable from './components/multisigwallet/owner-table';
import IconDappLogo from './components/icon/DappLogo';
import IconWaiting from './components/icon/Waiting';
import IconEye from './components/icon/Eye';
import IconTransaction from './components/icon/Transaction';
import IconAccepted from './components/icon/Accepted';
import IconUser from './components/icon/User';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            strError: null,
            activeKey: 1,
            blockchainEnabled: false,
            MultiSigWallet: null,
            account: "0x0000000000000000000000000000000000000000",
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
            this.timeout = setTimeout(() => { this.setState({ account: web3.eth.defaultAccount, blockchainEnabled: true }) }, 100)
        });

    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    setContractAddress(address, onError) {
        try {
            let checksumAddress = web3.utils.toChecksumAddress(address);
            this.checkContractAddress(checksumAddress, onError);
        } catch (error) {
            onError(error.toString())
        }

    }

    checkContractAddress(checksumAddress, onError) {
        try {
            web3.eth.getCode(checksumAddress).then((code) => {
                if (code.length > 2) {
                    this.setMSWInstance(new EmbarkJS.Blockchain.Contract({ abi: MultiSigWallet._jsonInterface, address: checksumAddress }), onError)
                } else {
                    onError("Address don't have any code. Might be wrong address, wrong network, or unsynced network.")
                }
            }).catch((error) => onError(error.toString()));
        } catch (error) {
            onError(error.toString())
        }
    }

    setMSWInstance(MultiSigWallet, onError) {
        const account = this.state.account;
        try {
            MultiSigWallet.methods.required().call().then((required) => {
                if (required > 0) {
                    if (account) {
                        MultiSigWallet.methods.isOwner(account).call().then((isOwner) => {
                            this.setState({ MultiSigWallet, isOwner });
                        }).catch((error) => onError(error.toString()));
                    } else {
                        this.setState({ MultiSigWallet, isOwner: false });
                    }
                } else {
                    onError("Invalid MultiSigWallet")
                }
            }).catch(() => onError("Not a Multisig Wallet")); 
        } catch (error) {
            onError("Unhandled error." + error.toString())
        }
    }

    render() {
        const {MultiSigWallet, blockchainEnabled, strError, isOwner, account, execWarn } = this.state;
        if (!blockchainEnabled) {
            return (
                <div>Waiting for blockchain.</div>
            )
        }
        return (
            <HashRouter hashType="noslash">
                {strError != null && <Alert variant="danger">{strError}</Alert>}
                {isOwner && execWarn && <Alert onClose={() => { this.setState({ execWarn: false }) }} variant="warning">Warning: You are legally responsable by what you approve. Only approve when you are sure the execution is desired.</Alert>}
                <Route path="/:address?" render={({ match }) => (
                    <React.Fragment>
                        <Navbar expand="sm" bg="light" variant="light">
                            <Navbar.Brand>
                                <LinkContainer to={"/" + (match.params.address ? match.params.address : "")}>
                                    <Nav.Link>
                                        <IconDappLogo/>
                                        <span>MultiSigWallet</span>
                                    </Nav.Link>
                                </LinkContainer>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                                {match.params.address ?
                                    <Nav className="mr-auto">
                                        <NavDropdown title={<span><IconTransaction/> Transactions</span>} id="nav-dropdown">
                                            <NavDropdown.Item as="div"><LinkContainer to={"/" + match.params.address + "/transactions"}><Nav.Link><IconEye/> All</Nav.Link></LinkContainer></NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as="div"><LinkContainer to={"/" + match.params.address + "/transactions/pending"}><Nav.Link><IconWaiting/> Pending</Nav.Link></LinkContainer></NavDropdown.Item>
                                            <NavDropdown.Item as="div"><LinkContainer to={"/" + match.params.address + "/transactions/executed"}><Nav.Link><IconAccepted/> Executed</Nav.Link></LinkContainer></NavDropdown.Item>
                                        </NavDropdown>
                                        <LinkContainer to={"/" + match.params.address + "/owners"}><Nav.Link><IconUser/> Owners</Nav.Link></LinkContainer>
                                    </Nav> 
                                    :
                                    <Nav />
                                }
                                <Navbar.Text>
                                    <EthAddress blockyScale={4} value={MultiSigWallet ? MultiSigWallet._address : account} />
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Navbar>
                        {MultiSigWallet ?
                            <React.Fragment /> 
                            :
                            <Container id="select-contract">
                                <h2>Open Multisig Wallet</h2> 
                                <CardColumns>
                                    <ContractLoader account={account} address={match.params.address} onChange={(address, onError) => this.setContractAddress(address, onError) } />
                                    {account && <MSWDeployer account={account} onDeploy={this.setMSWInstance} />}
                                </CardColumns>
                            </Container>
                        }
                    </React.Fragment>
                )} />
                <Route exact path="/:address?" render={() => (
                    MultiSigWallet ?
                        <Redirect to={"/" + MultiSigWallet.options.address + "/transactions/pending"} /> :
                        <React.Fragment />
                )} />
                <Route path="/:address/transactions/:mode?/:page?" render={({ match }) => (
                    MultiSigWallet &&
                    <Container id="transactions">
                        <h2>Transactions {match.params.mode}</h2>
                        <MSWTransactionTable
                            mode={match.params.mode}
                            page={match.params.page}
                            MultiSigWallet={MultiSigWallet}
                            account={account}
                            isOwner={isOwner} />
                    </Container>
                )} />
                <Route path="/:address/owners" render={() => (
                    MultiSigWallet &&
                    <Container id="owners">
                        <h2>Owners</h2>
                        <MSWOwnerTable
                            MultiSigWallet={MultiSigWallet}
                            account={account}
                            isOwner={isOwner} />
                    </Container>
                )} />


            </HashRouter>
        );
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
