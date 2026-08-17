import { CORE_CONCEPTS } from "./data";
import Header from "./components/Header/Header";
import CoreConcept from "./components/CoreConcept/CoreConcept";



// function CoreConcept(props) {
//   return (
//     <li>
//       <img src={props.image} alt={props.title} />
//       <h3>{props.title}</h3>
//       <p>{props.description}</p>
//     </li>
//   );
// }



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
