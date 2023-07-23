import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
  })

  return (
    <div>
      <textarea style={{width:`100%`, height:`100%`}}></textarea>
    </div>
  );
}

export default App;