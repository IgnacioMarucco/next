import React, { useState } from "react";

// don't change the Component name "App"
export default function App() {
  // TODO: Add state to conditionally show / dismiss the warning dialog

  const [clicked, setClicked] = useState(false);

  let boxContent = "";

  // function handleClick() {
  //   if (clicked === false) {
  //     setClicked(true);
  //   } else {
  //     setClicked(false);
  //   }
  // }

  // function handleClick() {
  //   clicked ? setClicked(false) : setClicked(true);
  // }

  function handleClick() {
    setClicked(!clicked);
  }

  if (!clicked) {
    boxContent = (
      <button
        onClick={() => {
          handleClick();
        }}
      >
        Delete
      </button>
    );
  } else {
    boxContent = (
      <div data-testid="alert" id="alert">
        <h2>Are you sure?</h2>
        <p>These changes can't be reverted!</p>
        <button
          onClick={() => {
            handleClick();
          }}
        >
          Proceed
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* TODO: Conditionally display warning div:
      <div data-testid="alert" id="alert">
        <h2>Are you sure?</h2>
        <p>These changes can't be reverted!</p>
        <button>Proceed</button>
      </div>
      */}

      {/* <button
        onClick={() => {
          handleClick(clicked);
        }}
      >
        Delete
      </button> */}
      {boxContent}
    </div>
  );
}
