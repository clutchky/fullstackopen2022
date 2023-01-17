import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ADD_BOOK, ALL_AUTHORS } from '../queries'

const Notify = ({ setError }) => {
  return <div style={ { "color": "red" } } >{setError}</div>
}

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('');

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
      setTimeout(() => {
        setError('');
      }, 5000)
    },
    refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ]
  });

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      if (!title || !author) {
        throw new Error("title or author must not be empty");
      }
      addBook({ variables: { 
        title, 
        author: author, 
        published: Number(published), 
        genres 
      } });

      console.log('add book...')

    } catch (e) {
      setError(e.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    }

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <Notify setError={error} />
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(', ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
