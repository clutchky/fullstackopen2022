import { Link } from 'react-router-dom';

const Blog = (props) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className="blog">
        <Link to={`/blogs/${props.blog.id}`}>{props.blog.title} - {props.blog.author}{' '}</Link>
      </div>
    </div>
  );
};

export default Blog;
