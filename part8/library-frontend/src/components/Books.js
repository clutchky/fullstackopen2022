import { useQuery } from '@apollo/client'
import { useState } from 'react';
import { ALL_BOOKS } from '../queries';
import Booklist from './Booklist';

const Books = (props) => {

  const books = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState('all genres');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const filterGenre = async (genre) => {
    const filteredGenres = books.data.allBooks.filter(b => b.genres.includes(genre));

    setGenre(genre);
    setFilteredBooks(filteredGenres);
  }

  if (!props.show) {
    return null
  }

  if (books.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <strong>{genre}</strong></p>}
      <div>
        <button onClick={() => filterGenre('sci-fi')} >sci-fi</button>
        <button onClick={() => filterGenre('fantasy')}>fantasy</button>
        <button onClick={() => filterGenre('crime')}>crime</button>
        <button onClick={() => filterGenre('all genres')}>all genres</button>
      </div>
      <Booklist genre={genre} filteredBooks={filteredBooks} books={books} />
    </div>
  )
}

export default Books
