import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../queries";
import Notify from "./Notify";

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    }
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      const value = await login({ variables: { username, password } });
      
      if (value.data) {
        setPage('authors')
      }

    } catch (error) {
      setPage('login')
    }

  }

  
  return (
    <div>
      <Notify setError={error} />
      <form onSubmit={submit}>
      <div>
        name 
        <input 
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password 
        <input 
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
      </form>
    </div>
  )
  
}

export default LoginForm