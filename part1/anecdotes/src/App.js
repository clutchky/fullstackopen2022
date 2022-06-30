import { useState } from "react";

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const Votes = ({vote}) => (
  <div>has {vote} votes</div>
)

const Anecdote = ({anecdote}) => {
  return (
    <div>  
      <h1>Anecdote of the day</h1>
      <div>{anecdote}</div>
    </div>
  )
}

const DisplayMostVotes = ({mostVotes, largestVotes}) => {  
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <div>{mostVotes()}</div>
      <div>has {largestVotes()} votes</div>
    </div>
  )
}

const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(
    new Array(anecdotes.length).fill(0)
  );

  const handleVote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  }

  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  }

  const largestVotes = () => {
    let largest = 0;

    for (var i = 0; i < anecdotes.length; i++) {
      if (votes[i] > largest) {
        largest = votes[i];
      }
    }
    return largest;
  }

  const mostVotes = () => anecdotes[votes.indexOf(largestVotes())];

  return (
    <div>
      <Anecdote anecdote={anecdotes[selected]} />
      <Votes vote={votes[selected]} />
      <Button handleClick={handleVote} text="vote"/>
      <Button handleClick={nextAnecdote} text="next anecdote" />
      <DisplayMostVotes mostVotes={mostVotes} largestVotes={largestVotes} />
    </div>
  )
}

export default App;