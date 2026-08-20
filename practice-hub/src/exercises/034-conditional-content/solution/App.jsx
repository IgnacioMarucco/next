import React from 'react';

// don't change the Component name "App"
export default function App() {
    const [isDeleting, setIsDeleting] = React.useState(false);
    
    function handleDelete() {
        setIsDeleting(true);
    }
    
    function handleProceed() {
        setIsDeleting(false);
    }
    
    let warning;
    
    if (isDeleting) {
        warning = (
            <div data-testid="alert" id="alert">
              <h2>Are you sure?</h2>
              <p>These changes can't be reverted!</p>
              <button onClick={handleProceed}>Proceed</button>
            </div>
        );
    }
    
    return (
      <div>
        {warning}
        <button onClick={handleDelete}>Delete</button>
      </div>    
    );
}