import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const updateItem = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);

  return response.data;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

const deleteItem = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  return axios.delete(`${baseUrl}/${id}`, config);
};

const addComment = async (id, commentObj) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, commentObj);

  return response.data;
};

const blogService = { create, updateItem, getAll, setToken, deleteItem, addComment };
export default blogService;
