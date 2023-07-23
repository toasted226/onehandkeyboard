import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";

function App() {
  invoke("new_dictionary");

  return (
    <div>
      <Textbox />
    </div>
  );
}

export default App;