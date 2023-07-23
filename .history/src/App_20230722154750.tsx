import { useState, useEffect } from "react";
import "/App.css";

function App() {
  const [windowWidth, setWindowWidth] = useState(0);

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