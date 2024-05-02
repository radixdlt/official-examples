import "./App.css";
import Navbar from "./components/Navbar";
import SelectAccount from "./components/SelectAccount";
import { useState } from "react";
import Menu from "./components/Menu";
import YieldTokenizerSection from "./components/YieldTokenizerSection";
import AmmSection from "./components/AmmSection";

function App() {
  const [selectedOption, setSelectedOption] = useState("Yield Tokenizer");

  return (
    <div id="container">
      <Navbar />
      <SelectAccount />
      <Menu
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      {selectedOption === "Yield Tokenizer" ? (
        <YieldTokenizerSection />
      ) : (
        <AmmSection />
      )}
    </div>
  );
}

export default App;
