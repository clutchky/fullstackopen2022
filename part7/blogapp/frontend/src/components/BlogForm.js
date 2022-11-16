const BlogForm = ({ createBlog }) => {

  const addBlog = async (event) => {
    event.preventDefault();

    const title = event.target.title.value;
    event.target.title.value = '';
    const author = event.target.author.value;
    event.target.author.value = '';
    const url = event.target.url.value;
    event.target.url.value = '';

    await createBlog({
      title: title,
      author: author,
      url: url
    });

  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>title</label>
          <input
            id="blog-title"
            name="title"
          />
        </div>
        <div>
          <label>author</label>
          <input
            id="blog-author"
            name="author"
          />
        </div>
        <div>
          <label>url</label>
          <input
            id="blog-url"
            name="url"
          />
        </div>
        <button type="submit" id="create-btn">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
