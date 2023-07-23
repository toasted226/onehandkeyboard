import { useState, useEffect } from "react";
import "/App.css";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  setWindowWidth(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      
    }

    window.addEventListener('resize', handleResize);
  })

  return (
    <div>
      <textarea></textarea>
    </div>
  );
}

export default App;