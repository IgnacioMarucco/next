import "./CourseGoal.css";

export default function CourseGoal({title, description}) {
    return (
      <li className="course-goal">
        <h2>{title}</h2>
        <p>{description}</p>
      </li>
    );
}