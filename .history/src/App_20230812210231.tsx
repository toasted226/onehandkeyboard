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
            <p>First time set-up.</p>
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