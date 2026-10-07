import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import HomeLogo from '../components/HomeLogo';
import { currentUser, signIn } from '../lib/auth';
import usePresence from '../lib/usePresence';

export default function SignInPage() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const errorMsg = usePresence(error);

  if (currentUser()) return <Navigate to="/app" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (signIn(username, password)) {
      navigate('/app', { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="signin-page st-board" data-theme="meterzero">
      <form className="signin-card" onSubmit={handleSubmit} noValidate aria-label="Sign in">
        <Link to="/" className="signin-logo" aria-label="MeterZero home">
          <HomeLogo />
        </Link>

        <div className="signin-body">
          <label className="signin-field">
            <span className="signin-label">Username</span>
            <input
              className="signin-input"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
            />
          </label>

          <label className="signin-field">
            <span className="signin-label">Password</span>
            <input
              className="signin-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </label>

          <p className="signin-error" role="alert">
            {errorMsg.present && (
              <span className="signin-error-msg" data-state={errorMsg.state}>{errorMsg.value}</span>
            )}
          </p>

          <button type="submit" className="btn btn-neutral btn-lg">
            Sign in
            <i className="hn hn-arrow-right" aria-hidden="true" />
          </button>

          <p className="signin-hint">Demo account: <strong>demo</strong> / <strong>demo</strong></p>
        </div>
      </form>
    </div>
  );
}
