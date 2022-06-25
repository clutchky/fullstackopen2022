const Header = (props) => {
  return (
    <>
      <h1>{props.name}</h1>
    </>
  )
}

const Part = (props) => {

  const {name, exercises} = props.part;
  
  return (
    <>
      <p>
        {name} {exercises}
      </p>
    </>
  )
}

const Content = (props) => {
  
  const [part1, part2, part3] = props.parts;

  return (
    <>
      <Part part={part1} />
      <Part part={part2} />
      <Part part={part3} />
    </>
  )
}

const Total = (props) => {

  const [part1, part2, part3] = props.exercises;

  return(
    <>
      <p>Number of exercises {part1.exercises + part2.exercises + part3.exercises}</p>
    </>
  )
}

const App = () => {
  const course = { 
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total exercises={course.parts} />
    </div>
  )
}

export default App;
