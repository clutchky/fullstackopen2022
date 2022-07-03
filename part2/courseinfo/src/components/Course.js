const Header = ({ courseName }) => <h1>{courseName}</h1>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {

  const total = parts.reduce((sum, part) =>
    sum + part.exercises, 0
  );

  return (
    <div>
      {parts.map((part) =>
        <Part key={part.id} part={part} />
      )}
      <p><strong>total of {total} exercises</strong></p>
    </div>
  )
}

const Course = ({ course }) => {

    const { name, parts } = course;
  
    return (
      <div>
        <Header courseName={name} />
        <Content parts={parts} />
      </div>
    )
  }

export default Course