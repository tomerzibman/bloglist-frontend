import { useState } from 'react';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLoginSubmit = async (event) => {
    event.preventDefault();
    const credentials = {
      username,
      password,
    };
    await handleLogin(credentials);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={onLoginSubmit}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          id="username"
        />
      </div>
      <div>
        password
        <input
          type="text"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          id="password"
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );
};

export default LoginForm;
