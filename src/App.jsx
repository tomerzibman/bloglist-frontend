import { useState, useEffect } from "react";

import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";

import blogService from "./services/blogs";
import loginService from "./services/login";
import LogoutButton from "./components/LogoutButton";
import BlogForm from "./components/BlogForm";
import ErrorNotification from "./components/ErrorNotification";
import SuccessNotification from "./components/SuccessNotification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isLoggedIn = user !== null;

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem("loggedInJSON");
    if (loggedInJSON) {
      const user = JSON.parse(loggedInJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedInJSON", JSON.stringify(user));
      setSuccessMessage(`Successfully logged in as ${user.username}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      let msg = "Error: login failed";
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
    window.localStorage.removeItem("loggedInJSON");
    setUser(null);
    setSuccessMessage("Successfully logged out");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title,
      author,
      url,
    };
    try {
      const blog = await blogService.create(blogObject);
      const newBlogs = blogs.concat(blog);
      setBlogs(newBlogs);
      setTitle("");
      setAuthor("");
      setUrl("");
      setSuccessMessage(`Successfully added ${blog.title} by ${blog.author}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      let msg = "Error: failed to add blog";
      if (error.resposne) {
        msg = error.response.data.error;
      }
      setErrorMessage(msg);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error(error);
    }
  };

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      {!isLoggedIn && (
        <div>
          <h2>log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} is logged in{" "}
            <LogoutButton handleLogout={handleLogout} />
          </p>
          <BlogForm
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
            addBlog={addBlog}
          />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
