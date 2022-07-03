
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

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course =>
          <Course key={course.id} course={course} />
        )}
    </div>
  )
}

export default App;