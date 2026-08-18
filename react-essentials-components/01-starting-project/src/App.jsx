import { useState } from "react";

import { CORE_CONCEPTS } from "./data";
import Header from "./components/Header/Header";
import CoreConcept from "./components/CoreConcept/CoreConcept";
import TabButton from "./components/TabButton/TabButton";
import CourseGoal from "./components/CourseGoal/CourseGoal";
import { EXAMPLES } from "./data";

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
  const [selectedTab, setSelectedTab] = useState();

  function handleSelect(selectedTab) {
    // selectedButton => 'components', 'jsx', 'props', 'state'
    setSelectedTab(selectedTab);
    console.log(selectedTab);
  }

  let tabContent = <p>Please select a tab.</p>;

  if (selectedTab) {
    tabContent = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedTab].title}</h3>
        <p>{EXAMPLES[selectedTab].description}</p>
        <pre>
          <code>{EXAMPLES[selectedTab].code}</code>
        </pre>
      </div>
    );
  }

  
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
        <section id="course-goals">
          <ul>
            <CourseGoal title="Learn React" description="In-depth" />
            <CourseGoal
              title="Build a React App"
              description="Apply your knowledge of React to build a real-world application."
            />
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton
              isActive={selectedTab === "components"}
              onSelect={() => handleSelect("components")}
            >
              Components
            </TabButton>
            <TabButton
              isActive={selectedTab === "jsx"}
              onSelect={() => handleSelect("jsx")}
            >
              JSX
            </TabButton>
            <TabButton
              isActive={selectedTab === "props"}
              onSelect={() => handleSelect("props")}
            >
              Props
            </TabButton>
            <TabButton
              isActive={selectedTab === "state"}
              onSelect={() => handleSelect("state")}
            >
              State
            </TabButton>
          </menu>
          {tabContent}
        </section>
      </main>
    </div>
  );
}

export default App;
