function Menu({ selectedOption, setSelectedOption }) {
  return (
    <>
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
    </>
  );
}

export default Menu;
