import { useState } from 'react';

const Blog = ({ blog, incrementLikeOf, deleteBlogWithId }) => {
  const [visible, setVisible] = useState(false);

  const toggleVis = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const incrementLike = () => {
    incrementLikeOf(blog.id);
  };

  const deleteBlog = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlogWithId(blog.id);
    }
  };

  const showWhenVisible = { display: visible ? '' : 'none' };

  const buttonText = visible ? 'hide' : 'show';

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVis}>{buttonText}</button>
      <div style={showWhenVisible} className="details">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={incrementLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
        <div>
          <button onClick={deleteBlog}>remove</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
