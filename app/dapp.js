import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from '../embarkArtifacts/embarkjs';
import MultiSigWallet from 'Embark/contracts/MultiSigWallet';
import ContractLoader from './components/multisigwallet/loader';
import MSWDeployer from './components/multisigwallet/deployer';
import { HashRouter, Route, Redirect, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import './dapp.css';
import { Navbar, Nav, Alert, NavDropdown, Container, CardColumns } from 'react-bootstrap';
import EthAddress from './components/EthAddress';
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
                                        <svg width="30" height="30" viewBox="0 0 124 124" xmlns="http://www.w3.org/2000/svg">
                                            <path 
                                                d="M72.458 61.429c-7.431.427-12.088-1.299-19.52-.871a31.245 31.245 0 0 0-5.47.796C48.565 47.65 58.292 35.662 71.519 34.9c8.117-.467 16.23 4.53 16.67 12.642.433 7.973-5.664 13.307-15.73 13.886M52.503 89.46c-7.776.438-15.547-4.24-15.969-11.831-.415-7.462 5.427-12.454 15.07-12.996 7.118-.4 11.58 1.216 18.698.815a30.589 30.589 0 0 0 5.24-.745C74.493 77.528 65.175 88.748 52.503 89.46M62 .181C27.758.18 0 27.857 0 62s27.758 61.82 62 61.82c34.242 0 62-27.678 62-61.82C124 27.858 96.242.18 62 .18" 
                                                fill="#4360DF" 
                                                fillRule="evenodd"/>
                                        </svg>
                                        <span>MultiSigWallet</span>
                                    </Nav.Link>
                                </LinkContainer>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                                {match.params.address ?
                                    <Nav className="mr-auto">
                                        <NavDropdown title={<span><svg className="svg-icon" viewBox="0 0 20 20">
                                            <path d="M17.498,11.697c-0.453-0.453-0.704-1.055-0.704-1.697c0-0.642,0.251-1.244,0.704-1.697c0.069-0.071,0.15-0.141,0.257-0.22c0.127-0.097,0.181-0.262,0.137-0.417c-0.164-0.558-0.388-1.093-0.662-1.597c-0.075-0.141-0.231-0.22-0.391-0.199c-0.13,0.02-0.238,0.027-0.336,0.027c-1.325,0-2.401-1.076-2.401-2.4c0-0.099,0.008-0.207,0.027-0.336c0.021-0.158-0.059-0.316-0.199-0.391c-0.503-0.274-1.039-0.498-1.597-0.662c-0.154-0.044-0.32,0.01-0.416,0.137c-0.079,0.106-0.148,0.188-0.22,0.257C11.244,2.956,10.643,3.207,10,3.207c-0.642,0-1.244-0.25-1.697-0.704c-0.071-0.069-0.141-0.15-0.22-0.257C7.987,2.119,7.821,2.065,7.667,2.109C7.109,2.275,6.571,2.497,6.07,2.771C5.929,2.846,5.85,3.004,5.871,3.162c0.02,0.129,0.027,0.237,0.027,0.336c0,1.325-1.076,2.4-2.401,2.4c-0.098,0-0.206-0.007-0.335-0.027C3.001,5.851,2.845,5.929,2.77,6.07C2.496,6.572,2.274,7.109,2.108,7.667c-0.044,0.154,0.01,0.32,0.137,0.417c0.106,0.079,0.187,0.148,0.256,0.22c0.938,0.936,0.938,2.458,0,3.394c-0.069,0.072-0.15,0.141-0.256,0.221c-0.127,0.096-0.181,0.262-0.137,0.416c0.166,0.557,0.388,1.096,0.662,1.596c0.075,0.143,0.231,0.221,0.392,0.199c0.129-0.02,0.237-0.027,0.335-0.027c1.325,0,2.401,1.076,2.401,2.402c0,0.098-0.007,0.205-0.027,0.334C5.85,16.996,5.929,17.154,6.07,17.23c0.501,0.273,1.04,0.496,1.597,0.66c0.154,0.047,0.32-0.008,0.417-0.137c0.079-0.105,0.148-0.186,0.22-0.256c0.454-0.453,1.055-0.703,1.697-0.703c0.643,0,1.244,0.25,1.697,0.703c0.071,0.07,0.141,0.15,0.22,0.256c0.073,0.098,0.188,0.152,0.307,0.152c0.036,0,0.073-0.004,0.109-0.016c0.558-0.164,1.096-0.387,1.597-0.66c0.141-0.076,0.22-0.234,0.199-0.393c-0.02-0.129-0.027-0.236-0.027-0.334c0-1.326,1.076-2.402,2.401-2.402c0.098,0,0.206,0.008,0.336,0.027c0.159,0.021,0.315-0.057,0.391-0.199c0.274-0.5,0.496-1.039,0.662-1.596c0.044-0.154-0.01-0.32-0.137-0.416C17.648,11.838,17.567,11.77,17.498,11.697 M16.671,13.334c-0.059-0.002-0.114-0.002-0.168-0.002c-1.749,0-3.173,1.422-3.173,3.172c0,0.053,0.002,0.109,0.004,0.166c-0.312,0.158-0.64,0.295-0.976,0.406c-0.039-0.045-0.077-0.086-0.115-0.123c-0.601-0.6-1.396-0.93-2.243-0.93s-1.643,0.33-2.243,0.93c-0.039,0.037-0.077,0.078-0.116,0.123c-0.336-0.111-0.664-0.248-0.976-0.406c0.002-0.057,0.004-0.113,0.004-0.166c0-1.75-1.423-3.172-3.172-3.172c-0.054,0-0.11,0-0.168,0.002c-0.158-0.312-0.293-0.639-0.405-0.975c0.044-0.039,0.085-0.078,0.124-0.115c1.236-1.236,1.236-3.25,0-4.486C3.009,7.719,2.969,7.68,2.924,7.642c0.112-0.336,0.247-0.664,0.405-0.976C3.387,6.668,3.443,6.67,3.497,6.67c1.75,0,3.172-1.423,3.172-3.172c0-0.054-0.002-0.11-0.004-0.168c0.312-0.158,0.64-0.293,0.976-0.405C7.68,2.969,7.719,3.01,7.757,3.048c0.6,0.6,1.396,0.93,2.243,0.93s1.643-0.33,2.243-0.93c0.038-0.039,0.076-0.079,0.115-0.123c0.336,0.112,0.663,0.247,0.976,0.405c-0.002,0.058-0.004,0.114-0.004,0.168c0,1.749,1.424,3.172,3.173,3.172c0.054,0,0.109-0.002,0.168-0.004c0.158,0.312,0.293,0.64,0.405,0.976c-0.045,0.038-0.086,0.077-0.124,0.116c-0.6,0.6-0.93,1.396-0.93,2.242c0,0.847,0.33,1.645,0.93,2.244c0.038,0.037,0.079,0.076,0.124,0.115C16.964,12.695,16.829,13.021,16.671,13.334 M10,5.417c-2.528,0-4.584,2.056-4.584,4.583c0,2.529,2.056,4.584,4.584,4.584s4.584-2.055,4.584-4.584C14.584,7.472,12.528,5.417,10,5.417 M10,13.812c-2.102,0-3.812-1.709-3.812-3.812c0-2.102,1.71-3.812,3.812-3.812c2.102,0,3.812,1.71,3.812,3.812C13.812,12.104,12.102,13.812,10,13.812"></path>
                                        </svg> Transactions</span>} id="nav-dropdown">
                                            <NavDropdown.Item as="div"><LinkContainer to={"/" + match.params.address + "/transactions"}><Nav.Link><svg className="svg-icon" viewBox="0 0 20 20">
                                                <path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
                                            </svg> All</Nav.Link></LinkContainer></NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as="div"><LinkContainer to={"/" + match.params.address + "/transactions/pending"}><Nav.Link><svg className="svg-icon" viewBox="0 0 20 20">
                                                <path d="M10.25,2.375c-4.212,0-7.625,3.413-7.625,7.625s3.413,7.625,7.625,7.625s7.625-3.413,7.625-7.625S14.462,2.375,10.25,2.375M10.651,16.811v-0.403c0-0.221-0.181-0.401-0.401-0.401s-0.401,0.181-0.401,0.401v0.403c-3.443-0.201-6.208-2.966-6.409-6.409h0.404c0.22,0,0.401-0.181,0.401-0.401S4.063,9.599,3.843,9.599H3.439C3.64,6.155,6.405,3.391,9.849,3.19v0.403c0,0.22,0.181,0.401,0.401,0.401s0.401-0.181,0.401-0.401V3.19c3.443,0.201,6.208,2.965,6.409,6.409h-0.404c-0.22,0-0.4,0.181-0.4,0.401s0.181,0.401,0.4,0.401h0.404C16.859,13.845,14.095,16.609,10.651,16.811 M12.662,12.412c-0.156,0.156-0.409,0.159-0.568,0l-2.127-2.129C9.986,10.302,9.849,10.192,9.849,10V5.184c0-0.221,0.181-0.401,0.401-0.401s0.401,0.181,0.401,0.401v4.651l2.011,2.008C12.818,12.001,12.818,12.256,12.662,12.412"></path>
                                            </svg> Pending</Nav.Link></LinkContainer></NavDropdown.Item>
                                            <NavDropdown.Item as="div"><LinkContainer to={"/" + match.params.address + "/transactions/executed"}><Nav.Link><svg className="svg-icon" viewBox="0 0 20 20">
                                                <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                                            </svg> Executed</Nav.Link></LinkContainer></NavDropdown.Item>
                                        </NavDropdown>
                                        <LinkContainer to={"/" + match.params.address + "/owners"}><Nav.Link><svg className="svg-icon" viewBox="0 0 20 20">
                                            <path d="M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z"></path>
                                        </svg> Owners</Nav.Link></LinkContainer>
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
