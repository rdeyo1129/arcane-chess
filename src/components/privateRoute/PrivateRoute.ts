import { useNavigate } from 'react-router-dom';

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRoute({
  isAuthenticated,
  outlet,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  if (isAuthenticated) {
    return outlet;
  } else {
    navigate('/login');
  }
}
