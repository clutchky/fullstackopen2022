import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const User = (props) => {

  const user = useQuery(ME);
  const books = useQuery(ALL_BOOKS);
  const userData = user.data;
  const bookData = books.data;

  if(!props.show) {
    return null;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        <p>books based on your favorite genre <strong>{userData.me.favouriteGenre}</strong></p>
        <div>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {bookData.allBooks.filter(b => 
                b.genres.includes(userData.me.favouriteGenre)).map((b) => 
                  <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author ? b.author.name : ""}</td>
                    <td>{b.published}</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default User;