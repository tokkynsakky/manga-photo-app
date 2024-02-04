import logo from "./logo.svg";
import "./App.css";
import Video from "./video";

function App() {
  return (
    <div className="area">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="Main">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Video />
      </div>
    </div>
  );
}

export default App;
