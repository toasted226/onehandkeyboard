import { useState, useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
  })

  return (
    <div>
      <textarea style={{width:`100%`}}></textarea>
    </div>
  );
}

export default App;