import React from 'react';

export function CourseGoal(props) {
  // TODO: Accept title and description props and output them
  return (
    <li>
      <h2>{/* TODO: Title */}</h2>
      <p>{/* TODO: Description */}</p>
    </li>
  );
}

function App() {
  return (
    <div id="app" data-testid="app">
      <h1>Time to Practice</h1>
      <p>One course, many goals! 🎯</p>
      <ul>
        {/* TODO: Render at least two <CourseGoal /> components */}
      </ul>
    </div>
  );
}

export default App;
