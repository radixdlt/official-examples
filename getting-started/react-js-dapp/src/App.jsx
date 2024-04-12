import "./App.css";
import DevModeInstruction from "./components/DevModeInstruction";
import Navbar from "./components/Navbar";
import DocumentationSection from "./components/DocumentationSection";
import HelloTokenSection from "./components/HelloTokenSection";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <DevModeInstruction />
        <HelloTokenSection />
        <DocumentationSection />
      </main>
    </>
  );
}

export default App;
