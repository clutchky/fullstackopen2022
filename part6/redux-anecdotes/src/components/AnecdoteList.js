import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer';

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
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (!filter) {
      return anecdotes
    }
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  })
  const dispatch = useDispatch()

  const sortedAnecdotes = [...anecdotes].sort((a,b) => b.votes - a.votes);

  const vote = async (id) => {
    const votedAnecdote = sortedAnecdotes.find(a => a.id === id);
    dispatch(addVote(id, votedAnecdote))
    dispatch(setNotification(`you voted '${votedAnecdote.content}'`, 10));
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