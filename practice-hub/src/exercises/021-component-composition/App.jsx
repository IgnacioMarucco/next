import React from 'react';
import Card from './Card';

function App() {
  return (
    <div id="app">
      <h1>Available Exercises</h1>
      <Card name="Maria Miles">
        <p>
          Maria is a professor of Computer Science at the University of
          Illinois.
        </p>
        <p>
          <a href="mailto:maria@example.com">Email Maria</a>
        </p>
      </Card>

      <Card name="Manuel Lorenz">
        <p>
          Manuel is a professor of Information Systems at the University of
          Stuttgart.
        </p>
        <p>
          <a href="mailto:manuel@example.com">Email Manuel</a>
        </p>
      </Card>
    </div>
  );
}

export default App;
