import "./App.css";
import InteractiveBase from "./components/interactive/InteractiveBase";
import InteractiveControls from "./components/interactive-controls/InteractiveControls";

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="main-title">Bounce House</h1>
        <p className="subtitle">
          Mirror, mirror, on the wall. And that wall. And maybe the other wall
          too.
        </p>
      </header>

      <InteractiveControls />
      <main className="main-content">
        <div className="interactive-container">
          <InteractiveBase />
        </div>
      </main>
    </div>
  );
}

export default App;
