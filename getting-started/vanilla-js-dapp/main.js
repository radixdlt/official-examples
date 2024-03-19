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
const dAppId = 'account_tdx_2_128jm6lz94jf9tnec8d0uqp23xfyu7yc2cyrnquda4k0nnm8gghqece'
// Instantiate DappToolkit
const rdt = RadixDappToolkit({
  dAppDefinitionAddress: dAppId,
  networkId: RadixNetwork.Stokenet, // network ID 2 is for the stokenet test network, network ID 1 is for mainnet
  applicationName: 'Hello Token dApp',
  applicationVersion: '1.0.0',
})
console.log("dApp Toolkit: ", rdt)

// Global States
let accounts;
let accountAddress;
let componentAddress = 'component_tdx_2_1cpr0ktltkg2xagzm7u4xqlqtpp8msw8069t647kp739clm98fd7296'


// ************ Fetch the user's account address ************
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1))
// Subscribe to updates to the user's shared wallet data
rdt.walletApi.walletData$.subscribe((walletData) => {
  console.log("subscription wallet data: ", walletData)
  // set the account address to the first account in the wallet
  accountAddress = walletData.accounts[0].address
  // add all shared accounts to the account select dropdown
  accounts = walletData.accounts
  let accountSelect = document.getElementById('select-dropdown')
  accounts.map((account) => {
    console.log("account: ", account)
    let shortAddress = account.address.slice(0, 4) + "..." + account.address.slice(account.address.length - 6, account.address.length)
    let li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.innerHTML = `
      <input type="radio" name="account" id="" value="${account.address}">
      <label for="${account.label}">
        ${account.label} ${shortAddress}
      </label>
    `;
    accountSelect.appendChild(li);
  })
  // Custom Account Select
  const customSelect = document.querySelector(".custom-select");
  const selectBtn = document.querySelector(".select-button");

  // add a click event to select button
  selectBtn.addEventListener("click", () => {
    // add/remove active class on the container element
    customSelect.classList.toggle("active");
    // update the aria-expanded attribute based on the current state
    selectBtn.setAttribute(
      "aria-expanded",
      selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
    );
  });

  const selectedValue = document.querySelector(".selected-value");
  const optionsList = document.querySelectorAll(".select-dropdown li");

  optionsList.forEach((option) => {
    function handler(e) {
      // Click Events
      if (e.type === "click" && e.clientX !== 0 && e.clientY !== 0) {
        selectedValue.textContent = this.children[1].textContent;
        console.log("selectedValue: ", selectedValue.textContent);
        accountAddress = this.children[0].value;
        console.log("accountAddress: ", accountAddress);
        customSelect.classList.remove("active");
      }
      // Key Events
      if (e.key === "Enter") {
        selectedValue.textContent = this.textContent;
        customSelect.classList.remove("active");
      }
    }

    option.addEventListener("keyup", handler);
    option.addEventListener("click", handler);
  });
})


// Send a transaction to the wallet when user clicks on the claim token button Id=get-hello-token
document.getElementById('get-hello-token').onclick = async function () {

  let manifest = `
  CALL_METHOD
    Address("${componentAddress}")
    "free_token"
    ;
  CALL_METHOD
    Address("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
    ;
  `
  console.log("manifest: ", manifest)
  // Send manifest to extension for signing
  const result = await rdt.walletApi
    .sendTransaction({
      transactionManifest: manifest,
      version: 1,
    })
  if (result.isErr()) throw result.error;
  console.log("free token result:", result.value);
  let getCommitReceipt = await rdt.gatewayApi.transaction.getCommittedDetails(result.value.transactionIntentHash)
  console.log('getCommittedDetails:', getCommitReceipt)
}



