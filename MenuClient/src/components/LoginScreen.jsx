import { useState } from 'react';

export function LoginScreen({ onLogin, isLoading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg-shape" />
      <form className="admin-login__card" onSubmit={submit}>
        <p className="admin-login__eyebrow">Dashboard Access</p>
        <h1>Admin Login</h1>
        <p className="admin-login__text">
          Use your email and password. The system detects automatically if you are super-admin or
          tenant-admin and opens the right access level.
        </p>

        <label>
          Email
          <input
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@menu.local"
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
            type="password"
            value={password}
          />
        </label>

        <button disabled={isLoading} type="submit">
          {isLoading ? 'Logging in...' : 'Open Dashboard'}
        </button>
        {error ? <p className="admin-login__error">{error}</p> : null}
      </form>
    </div>
  );
}
