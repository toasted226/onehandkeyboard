import { useState, useEffect } from "react";
import "/App.css";

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight();
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