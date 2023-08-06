import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";
import { useState } from "react";

function App() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    await invoke("new_dictionary");
    setLoaded(true);
  }

  return (
    <div>
      <Textbox />
    </div>
  );
}

export default App;