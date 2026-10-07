import { Navigate } from 'react-router-dom';
import { currentUser } from '../lib/auth';

export default function RequireAuth({ children }) {
  if (!currentUser()) return <Navigate to="/signin" replace />;
  return children;
}
