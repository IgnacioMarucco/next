import React from 'react';

// don't change the Component name "App"
export default function App() {
  // TODO: Add a state value using React.useState and update it from $100 to $75 on button click

  return (
    <div>
      <p data-testid="price">$100</p>
      <button>Apply Discount</button>
    </div>
  );
}
