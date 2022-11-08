import PropTypes from 'prop-types';

const BlogDetails = ({ blog, likes, handleRemove, updateLike, owner }) => {
  const handleLike = async () => {
    await updateLike(blog.id, {
      ...blog,
      likes: likes + 1,
    });
  };

  const deleteBlog = async () => {
    await handleRemove(blog.id, blog);
  };

  const user = JSON.parse(JSON.stringify(blog.user));
  const isOwner = owner.username === user.username;

  const removeButton = () => {
    return <button onClick={deleteBlog}>remove</button>;
  };

  return (
    <div className="blogDetails">
      {blog.url}
      <br />
      likes <span>{likes}</span> <button onClick={handleLike}>like</button>
      <br />
      {user.name}
      <br />
      {isOwner && removeButton()}
    </div>
  );
};

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLike: PropTypes.func.isRequired,
  likes: PropTypes.number.isRequired,
  handleRemove: PropTypes.func.isRequired,
  owner: PropTypes.object.isRequired,
};

export default BlogDetails;
