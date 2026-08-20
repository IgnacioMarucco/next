import React from 'react';

// don't change the Component name "App"
export default function App() {
    const [price, setPrice] = React.useState(100);
    
    function clickHandler() {
        setPrice(75);
    }
    
    return (
        <div>
            <p data-testid="price">${price}</p>
            <button onClick={clickHandler}>Apply Discount</button>
        </div>
    );
}
