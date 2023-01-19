const Booklist = (props) => {
  if(props.genre !== 'all genres') {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author ? b.author.name : ""}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author ? b.author.name : ""}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Booklist