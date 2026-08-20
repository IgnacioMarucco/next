import React, { useState } from "react";

// don't change the Component name "App"
export default function App() {
  // TODO: Add state to toggle the 'active' class on click
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(!clicked);
  }

  return (
    <div>
      <p className={clicked ? "active" : ""}>Style me!</p>
      <button onClick={handleClick}>Toggle style</button>
    </div>
  );
}
