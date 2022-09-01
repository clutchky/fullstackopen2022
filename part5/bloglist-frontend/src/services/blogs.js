import axios from 'axios'
const baseUrl = '/api/blogs'

const setToken = newToken => {
  return `bearer ${newToken}`;
}

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data
}

const blogService = { getAll, setToken }
export default blogService