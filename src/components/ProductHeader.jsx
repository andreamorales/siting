import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSearch from './HeaderSearch';
import HomeLogo from './HomeLogo';
import { currentUser, signOut } from '../lib/auth';

export default function ProductHeader() {
  const navigate = useNavigate();
  const user = currentUser();

  const handleSignOut = () => {
    signOut();
    navigate('/signin', { replace: true });
  };

  return (
    <header className="dash-header">
      <div className="dash-header-start">
        <Link to="/app" className="dash-logo" aria-label="MeterZero dashboard">
          <HomeLogo />
        </Link>
        <Link to="/app/new" className="btn btn-neutral">
          <i className="hn hn-plus" aria-hidden="true" />
          New
        </Link>
      </div>
      <HeaderSearch />
      <div className="dash-header-end">
        <span className="dash-user">
          <i className="hn hn-user" aria-hidden="true" />
          {user}
        </span>
        <button type="button" className="btn btn-outline" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
