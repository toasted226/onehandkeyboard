import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";
import { useState } from "react";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [firstTimeSetup, setFirstTimeSetup] = useState(false);

  if (!loaded) {
    let progress = invoke("new_dictionary");
    let first_launch = invoke("first_time_startup");
    first_launch.then((value) => {
      setFirstTimeSetup(value as boolean);
    });
    progress.then(() => {
      setLoaded(true);
    });
  }

  return (
    <div>
      {firstTimeSetup ? (
        <div className="panel">
          <div className="first-setup">
            <h1>Welcome!</h1>
            <p>Choose your keyboard layout: </p>
            <select>
              <option>Qwerty</option>
              <option>Dvorak</option>
            </select>
            <br></br>
            <button>Continue</button>
          </div>
        </div>
      ) : (<></>)}
      {loaded ? (<Textbox />) : (
        <div className="loading">
          <p>Loading dictionary...</p>
        </div>
      )}
    </div>
  );
}

export default App;