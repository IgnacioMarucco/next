import React from 'react';
import { useState } from "react";

// don't change the Component name "App"
export default function App() {
  // TODO: Add a state value using React.useState and update it from $100 to $75 on button click
let [price, setPrice] = useState("$100");

function handlePriceUpdate() {
  setPrice("$75");
}

  return (
    <div>
      <p data-testid="price">{price}</p>
      <button
        onClick={() => {
          handlePriceUpdate();
        }}
      >
        Apply Discount
      </button>
    </div>
  );
}
