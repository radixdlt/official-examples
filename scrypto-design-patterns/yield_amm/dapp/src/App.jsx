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

{
  /* <iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FoBAV5kV6g2XbWSsIGXJoiR%2FLanding-Page-Example-(Copy)%3Ftype%3Ddesign%26node-id%3D1-3%26t%3DrDQPdU9V0H2C1m8V-1%26scaling%3Dcontain%26page-id%3D0%253A1%26starting-point-node-id%3D1%253A3%26mode%3Ddesign" allowfullscreen></iframe> */
}
