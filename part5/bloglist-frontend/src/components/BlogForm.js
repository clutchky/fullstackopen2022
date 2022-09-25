import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async event => {
    event.preventDefault();

    await createBlog({
      title: title,
      author: author,
      url: url
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>title</label>
          <input value={title} onChange={({ target }) => setTitle(target.value)} id="blog-title" />
        </div>
        <div>
          <label>author</label>
          <input value={author} onChange={({ target }) => setAuthor(target.value)} id="blog-author" />
        </div>
        <div>
          <label>url</label>
          <input value={url} onChange={({ target }) => setUrl(target.value)} id="blog-url" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;