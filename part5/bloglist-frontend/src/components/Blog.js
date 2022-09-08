import { useState } from "react";

const Blog = ({blog}) => {
  const [visible, setVisible] = useState(false);
  const [buttonText, setButtonText] = useState('view');

  const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const handleClick = () => {
      setVisible(!visible);
      buttonText === 'view' 
      ? setButtonText('hide')
      : setButtonText('view');
    }

    const user = JSON.parse(JSON.stringify(blog.user));

    const blogDetails = () => {
      return (
        <div>
          {blog.url}<br/>
          likes {blog.likes} <button>like</button><br/>
          {user.name}
        </div>
      )
    }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} - {blog.author} <button onClick={handleClick}>{buttonText}</button><br/>
        {visible && blogDetails()}
      </div>
    </div>
  )
}

export default Blog