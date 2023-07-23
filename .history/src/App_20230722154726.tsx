import { useState, useEffect } from "react";
import "/App.css";

function App() {
  [windowWidth, setWindowWidth] = useState();

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