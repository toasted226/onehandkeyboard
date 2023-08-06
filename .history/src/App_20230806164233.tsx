import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Textbox from "./Textbox";
import { useState } from "react";
import { ReactComponent as SpinLogo} from "./assets/load-spin.svg";

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
          <img src={loadspin}/>
        </div>
      )}
    </div>
  );
}

export default App;