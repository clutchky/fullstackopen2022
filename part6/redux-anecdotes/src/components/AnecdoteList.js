import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
};

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes }) => anecdotes)
  const dispatch = useDispatch()

  const sortedAnecdotes = [...anecdotes].sort((a,b) => b.votes - a.votes);

  const vote = (id) => {
    dispatch(addVote(id))
  }

  return (
    <div>
      {sortedAnecdotes
      .map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote.id)}
        />
      )}
    </div>
  )
};

export default AnecdoteList;