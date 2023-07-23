import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";
import { useState } from "react";

function App() {
  const [loaded, setLoaded] = useState(false);

  invoke("new_dictionary");

  return (
    <div>
      <Textbox />
    </div>
  );
}

export default App;