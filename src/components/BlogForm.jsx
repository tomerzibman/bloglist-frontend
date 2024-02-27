import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title,
      author,
      url,
    };
    await createBlog(blogObject);
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }}
            placeholder="blog title"
            id="title"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => {
              setAuthor(target.value);
            }}
            placeholder="blog author"
            id="author"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => {
              setUrl(target.value);
            }}
            placeholder="blog url"
            id="url"
          />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
