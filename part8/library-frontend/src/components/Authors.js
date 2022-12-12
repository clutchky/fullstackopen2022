import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { ALL_AUTHORS, EDIT_BIRTHDATE } from "../queries";

const Authors = (props) => {

  const [name, setName] = useState('');
  const [born, setBornTo] = useState('');

  const authors = useQuery(ALL_AUTHORS);

  const [ changeBirthdate, result ] = useMutation(EDIT_BIRTHDATE, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("author not found")
    }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  if(authors.loading){
    return <div>loading...</div>
  }

  const updateBirthdate = (event) => {
    event.preventDefault();

    changeBirthdate({ variables: { name, setBornTo: Number(born) } })

    setName('');
    setBornTo('');
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form onSubmit={updateBirthdate}>
        <div>
          name <input value={name} onChange={({ target }) => setName(target.value)} />
        </div>
        <div>
          born <input type="number" value={born} onChange={({ target }) => setBornTo(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
