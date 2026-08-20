import React from 'react';

export default function Card({ ...props }) {
  // TODO: Build the Card component according to instructions in README.md
  // It should render: <div className="card"><h2>{name}</h2>{children}</div>
  return (
    <div className="card">
      <h2>{props.name}</h2>
      {props.children}
    </div>
  );
}
