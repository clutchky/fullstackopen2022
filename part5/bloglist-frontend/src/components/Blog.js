import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateLike, likes, handleRemove, owner }) => {
  const [visible, setVisible] = useState(false);
  const [buttonText, setButtonText] = useState('view');

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const handleClick = () => {
    setVisible(!visible);
    buttonText === 'view'
      ? setButtonText('hide')
      : setButtonText('view');
  };

  const handleLike = async () => {

    await updateLike(blog.id, {
      ...blog,
      likes: likes + 1
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

  const blogDetails = () => {
    return (
      <div>
        {blog.url}<br/>
          likes {likes} <button onClick={handleLike}>like</button><br/>
        {user.name}<br/>
        {isOwner && removeButton()}
      </div>
    );
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} - {blog.author} <button onClick={handleClick}>{buttonText}</button><br/>
        {visible && blogDetails()}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLike: PropTypes.func.isRequired,
  likes: PropTypes.number.isRequired,
  handleRemove: PropTypes.func.isRequired,
  owner: PropTypes.object.isRequired
};

export default Blog;