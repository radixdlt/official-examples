import "./App.css";
import Navbar from "./components/Navbar";
import TokenizeLsu from "./components/TokenizeLsu";
import RedeemLsu from "./components/RedeemLsu";
import Liquidity from "./components/Liquidity";
import SelectAccount from "./components/SelectAccount";

function App() {
  return (
    <div id="container">
      <Navbar />
      <h1>Yield Amm dApp</h1>
      <SelectAccount />
      <TokenizeLsu />
      <RedeemLsu />
      <Liquidity />
    </div>
  );
}

export default App;
