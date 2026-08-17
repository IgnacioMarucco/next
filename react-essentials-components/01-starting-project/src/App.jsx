import reactImg from "./assets/react-core-concepts.png";

import { CORE_CONCEPTS } from "./data";

const reactDescriptions = ["Fundamental", "Crucial", "Core"];

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function Header() {
  const description = reactDescriptions[genRandomInt(2)];

  return (
    <header>
      <img src={reactImg} alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {description} React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  );
}

// function CoreConcept(props) {
//   return (
//     <li>
//       <img src={props.image} alt={props.title} />
//       <h3>{props.title}</h3>
//       <p>{props.description}</p>
//     </li>
//   );
// }

function CoreConcept({ image, title, description }) {
  return (
    <li>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            {/* {CORE_CONCEPTS.map((concept, index) => (
              <CoreConcept
                title={concept.title}
                description={concept.description}
                image={concept.image}
                key={index}
              />
            ))}
            {CORE_CONCEPTS.map((concept, index) => (
              <CoreConcept key={index} {...CORE_CONCEPTS[index]} />
            ))} */}
            {CORE_CONCEPTS.map((conceptItem, index) => (
              <CoreConcept key={index} {...conceptItem} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
