import React from 'react';

export function CourseGoal({ title, description }) {
  // TODO: Accept title and description props and output them
  return (
    <li>
      <h2>{title}</h2>
      <p>{description}</p>
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
        <CourseGoal title="Learn React" description="In-depth" />
        <CourseGoal title="Learn Next" description="Lets gooooo" />
      </ul>
    </div>
  );
}

export default App;
