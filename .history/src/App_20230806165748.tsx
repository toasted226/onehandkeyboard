import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";
import { useState } from "react";
import Loadspin from "./assets/load-spin.svg";

function App() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    let progress = invoke("new_dictionary");
    progress.then(() => {
      setLoaded(true);
    });
  }

  return (
    <div>
      {loaded ? (<Textbox />) : (
        <div className="loading">
          <p>Loading dictionary...</p>
          <Loadspin style={{filter: "filter: invert(86%) sepia(74%) saturate(422%) hue-rotate(352deg) brightness(93%) contrast(101%);"}}/>
        </div>
      )}
    </div>
  );
}

export default App;