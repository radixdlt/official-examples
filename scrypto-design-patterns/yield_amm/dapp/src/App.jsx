import "./App.css";
import Navbar from "./components/Navbar";
import TokenizeLsu from "./components/TokenizeLsu";
import RedeemLsu from "./components/RedeemLsu";
import SelectAccount from "./components/SelectAccount";
import AddLiquidity from "./components/AddLiquidity";
import RemoveLiquidity from "./components/RemoveLiquidity";
import AmmInfo from "./components/AmmInfo";
import Swap from "./components/Swap";

function App() {
  return (
    <div id="container">
      <Navbar />
      <h1>Yield Amm dApp</h1>
      <SelectAccount />
      <h2>Yield Tokenizer</h2>
      <TokenizeLsu />
      <RedeemLsu />
      <h2>AMM</h2>
      <AmmInfo />
      <AddLiquidity />
      <RemoveLiquidity />
      <Swap />
    </div>
  );
}

export default App;
