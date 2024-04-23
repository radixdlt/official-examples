import "./App.css";
import Navbar from "./components/Navbar";
import TokenizeLsu from "./components/TokenizeLsu";
import RedeemLsu from "./components/RedeemLsu";
import SelectAccount from "./components/SelectAccount";
import AmmInfo from "./components/AmmInfo";
import { useState } from "react";

function App() {
  const [selectedOption, setSelectedOption] = useState("Yield Tokenizer");

  return (
    <div id="container">
      <Navbar />
      <h1>Yield AMM dApp</h1>
      <SelectAccount />
      <div className="pages">
        <button
          className="btn-dark"
          onClick={() => setSelectedOption("Yield Tokenizer")}
          disabled={selectedOption == "Yield Tokenizer"}
        >
          Yield Tokenizer
        </button>
        <button
          className="btn-dark"
          onClick={() => setSelectedOption("AMM")}
          disabled={selectedOption == "AMM"}
        >
          AMM
        </button>
      </div>

      {selectedOption === "Yield Tokenizer" && (
        <>
          <h2>Yield Tokenizer</h2>
          <TokenizeLsu />
          <RedeemLsu />
        </>
      )}

      {selectedOption === "AMM" && (
        <>
          <h2>AMM</h2>
          <AmmInfo />
        </>
      )}
    </div>
  );
}

export default App;
