export default function TabButton(props) {
    function handleClick() {
        console.log(`You clicked the ${props.children} tab!`);
    }

    return (
      <li>
        <button onClick={handleClick}>
          {props.children}
        </button>
      </li>
    );
} 