import { useState } from 'react';

const Blog = (props) => {
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

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {props.blog.title} - {props.blog.author} <button onClick={handleClick}>{buttonText}</button><br/>
        {visible && props.children}
      </div>
    </div>
  );
};

export default Blog;