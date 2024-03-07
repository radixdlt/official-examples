import './style.css'
import radixLogo from './assets/radix-logo-dark.png'
import developerImg from './assets/developer-img.png'
import devModeGif from './assets/dev-mode-setup.gif'
import helloTokens from './assets/hello-tokens.png'
import { RadixDappToolkit, DataRequestBuilder, RadixNetwork } from '@radixdlt/radix-dapp-toolkit'


// Inject the navbar into the DOM
document.querySelector('#navbar-container').innerHTML = `
    <div id="navbar">
      <img src="${radixLogo}" alt="scrypto logo" id="scrypto-logo" />
      <img src="${developerImg}" alt="radix logo" id="radix-logo" />
    </div>
    <div id="connect-btn">
      <radix-connect-button />
    </div>
`
document.querySelector('#dev-mode-gif').innerHTML = `<img src="${devModeGif}" alt="dev mode setup" />`
document.querySelector('#hello-tokens').innerHTML = `<img src="${helloTokens}" alt="hello tokens" />`

// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/dapp-metadata 
// then use that account for your dAppId
const dAppId = 'account_tdx_2_12yea7979c8e87zwsnx2pu53g67qruemy7ur2vsg8445l3fwgxly78q'
// Instantiate DappToolkit
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppId,
  networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
  applicationName: 'Hello Scrypto dApp',
  applicationVersion: '1.0.0',
})
console.log("dApp Toolkit: ", rdt)

// ************ Fetch the user's account address ************
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1))
// Subscribe to updates to the user's shared wallet data
rdt.walletApi.walletData$.subscribe((walletData) => {
  console.log("subscription wallet data: ", walletData)
})
