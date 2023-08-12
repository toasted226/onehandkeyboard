import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";
import { useState } from "react";

function App() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    let progress = invoke("new_dictionary");
    let first_launch = invoke("first_time_startup");
    first_launch.then((is_first_time: boolean) => {

    });
    progress.then(() => {
      setLoaded(true);
    });
  }

  return (
    <div>
      {loaded ? (<Textbox />) : (
        <div className="loading">
          <p>Loading dictionary...</p>
        </div>
      )}
    </div>
  );
}

export default App;