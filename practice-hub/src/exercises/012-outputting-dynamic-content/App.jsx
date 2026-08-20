import React from 'react';

export const userData = {
  firstName: 'Maximilian',
  lastName: 'Schwarzmüller',
  title: 'Instructor',
};

export function User() {
  return (
    <div id="user" data-testid="user">
      <h2>
        {/* TODO: Output user's first and last name from userData */}
      </h2>
      <p>{/* TODO: Output user's title from userData */}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Time to Practice</h1>
      <p>Welcome on board of this course! You got this 💪</p>
      <User />
    </div>
  );
}

export default App;
