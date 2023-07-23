import { useState, useEffect } from "react";
import "/App.css";

function App() {
  useEffect(() => {
    function handleResize() {
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
    
}

    window.addEventListener('resize', handleResize)
  })

  return (
    <div>
      <textarea></textarea>
    </div>
  );
}

export default App;