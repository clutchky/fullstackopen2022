const BlogForm = ({
  onSubmit,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
        <label>title</label>
        <input value={title} onChange={handleTitleChange} />
        </div>
        <div>
        <label>author</label>
        <input value={author} onChange={handleAuthorChange} />
        </div>
        <div>
        <label>url</label>
        <input value={url} onChange={handleUrlChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm;