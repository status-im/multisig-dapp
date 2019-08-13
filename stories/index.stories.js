
import EmbarkJS from '../embarkArtifacts/embarkjs';
export default EmbarkJS;
import MultiSigWallet from '../embarkArtifacts/contracts/MultiSigWallet';
import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import { action, actions } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text, boolean, number, object, select } from '@storybook/addon-knobs/react'

import EthCall from '../app/components/EthCall';
import EthAddress from '../app/components/EthAddress';
import EthValue from '../app/components/EthValue';
import EthData from '../app/components/EthData';
import HexData from '../app/components/HexData';
import EthAddressList from '../app/components/EthAddressList';
import { array } from '@storybook/addon-knobs/dist/deprecated';
import EthTransactionSubmit from '../app/components/EthTransactionSubmit';
import TransactionSubmitButton from '../app/components/TransactionSubmitButton';

const sendTx = new EmbarkJS.Blockchain.Contract({ abi: MultiSigWallet._jsonInterface, address: "0xB913626032140A86c77D1fdde4f611A00D589C55" }).methods.changeRequirement(1);

const tx = {
  to: "ethereum.eth",
  value: 0, 
  data: sendTx.encodeABI()
};

const txObj = {
 to: "0x3D597789ea16054a084ac84ce87F50df9198F415",
 value: 100000000000000000,
 data: "0x",
 nonce: null
};
const abi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}];

const commonEvents = actions({ onChange: 'onChange', onError: 'onError' });
const transactionEvents = actions({ onSubmission: 'onSubmission', onResult: 'onResult' , onReceipt: 'onReceipt' });

storiesOf('EthTransactionSubmit', module)
  .addDecorator(withKnobs)
  .add('web3.eth.sendTransaction', () => 
    <EthTransactionSubmit 
      value={object("Transaction", txObj)}     
      control={boolean('Control', true)} 
      disabled={boolean('Disabled', false)} 
      abi={object('ABI', abi)} 
      {...commonEvents} 
      {...transactionEvents} />)
  .add('web3.eth.Contract', () => 
    <EthTransactionSubmit 
      value={sendTx}  
      control={boolean('Control', true)} 
      disabled={boolean('Disabled', false)} 
      abi={object('ABI', abi)} 
      {...commonEvents}
      {...transactionEvents} />)



storiesOf('EthCall', module)
  .addDecorator(withKnobs)
  .add('default', () => <EthCall tx={object("Tx", tx)}  control={boolean('Control', true)} disabled={boolean('Disabled', false)} abi={object('ABI', abi)} {...commonEvents} />)

storiesOf('EthAddress', module)
  .addDecorator(withKnobs)
  .add('default', () => <EthAddress value={text('Value', tx.to)} control={boolean('Control', true)} disabled={boolean('Disabled', false)} allowZero={boolean('Allow zero', false)} colors={boolean('Show colors', true)} blocky={boolean('Show blocky', true)} blockyScale={number("Blocky Scale", 4)} blockySize={number("Blocky Size", 8)} {...commonEvents}  />)

storiesOf('EthValue', module)
  .addDecorator(withKnobs)
  .add('default', () => <EthValue value={text('Value', 100000000000000000)} control={boolean('Control', true)} disabled={boolean('Disabled', false)} {...commonEvents}   />)

storiesOf('EthData', module)
  .addDecorator(withKnobs)
  .add('default', () => <EthData value={text('Value', tx.data)} control={boolean('Control', true)} disabled={boolean('Disabled', false)} abi={object('ABI', abi)} {...commonEvents}  />)

storiesOf('HexData', module)
  .addDecorator(withKnobs)
  .add('default', () => <HexData buffer={Buffer.from(text('Data', "00112233445566778899AABBCCDDEEFF"), "hex")} rowLength={number("Row Length", 32)} setLength={number("Set Length", 4)} control={boolean('Control', true)} disabled={boolean('Disabled', false)} {...commonEvents}  />)

  storiesOf('EthAddressList', module)
  .addDecorator(withKnobs)
  .add('default', () => <EthAddressList values={array("Values", ["unicorn.stateofus.eth", "ethereum.eth", "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E"])} control={boolean('Control', true)} disabled={boolean('Disabled', false)} allowAdd={boolean('Allow add', true)} allowRemove={boolean('Allow remove', true)} allowZero={boolean('Allow zero', false)} colors={boolean('Show colors', true)} blocky={boolean('Show blocky', true)} blockyScale={number("Blocky Scale", 4)} blockySize={number("Blocky Size", 8)} {...commonEvents}  />)