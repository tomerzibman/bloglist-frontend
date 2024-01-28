import { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Toggleable from './components/Toggleable';

import blogService from './services/blogs';
import loginService from './services/login';
import LogoutButton from './components/LogoutButton';
import BlogForm from './components/BlogForm';
import ErrorNotification from './components/ErrorNotification';
import SuccessNotification from './components/SuccessNotification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const blogFormRef = useRef();

  const isLoggedIn = user !== null;

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem('loggedInJSON');
    if (loggedInJSON) {
      const user = JSON.parse(loggedInJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedInJSON', JSON.stringify(user));
      setSuccessMessage(`Successfully logged in as ${user.username}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      let msg = 'Error: login failed';
      if (exception.response) {
        msg = exception.response.data.error;
      }
      setErrorMessage(msg);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.log(exception);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInJSON');
    setUser(null);
    setSuccessMessage('Successfully logged out');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const incrementLikeOf = async (blogId) => {
    const blogToUpdate = blogs.find((blog) => blog.id === blogId);
    try {
      const updatedBlog = await blogService.update(
        {
          likes: blogToUpdate.likes + 1,
        },
        blogToUpdate.id,
      );
      const updatedBlogs = blogs.map((blog) =>
        blog.id === blogId ? updatedBlog : blog,
      );
      setBlogs(updatedBlogs);
    } catch (error) {
      let msg = 'Error: liking blog failed';
      if (error.response) {
        msg = error.response.data.error;
      }
      setErrorMessage(msg);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.log(error);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const blog = await blogService.create(blogObject);
      const newBlogs = blogs.concat(blog);
      setBlogs(newBlogs);
      setSuccessMessage(`Successfully added ${blog.title} by ${blog.author}`);
      setTimeout(() => {
        setSuccessMessage(null);
        console.log(blog);
      }, 5000);
    } catch (error) {
      let msg = 'Error: failed to add blog';
      if (error.response) {
        msg = error.response.data.error;
      }
      setErrorMessage(msg);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error(error);
    }
  };

  const deleteBlogWithId = async (blogId) => {
    try {
      await blogService.remove(blogId);
      const filteredBlogs = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(filteredBlogs);
      setSuccessMessage('Successfully removed blog');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      let msg = 'Error: failed to remove blog';
      if (error.response) {
        msg = error.response.data.error;
      }
      setErrorMessage(msg);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error(error);
    }
  };

  const blogsToShow = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      {!isLoggedIn && (
        <div>
          <h2>log in to application</h2>
          <LoginForm handleLogin={handleLogin} />
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} is logged in{' '}
            <LogoutButton handleLogout={handleLogout} />
          </p>
          <Toggleable ref={blogFormRef} buttonLabel="new blog">
            <BlogForm createBlog={addBlog} />
          </Toggleable>
          {blogsToShow.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              incrementLikeOf={incrementLikeOf}
              deleteBlogWithId={deleteBlogWithId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
