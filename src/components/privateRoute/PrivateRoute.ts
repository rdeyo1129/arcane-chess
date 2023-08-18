import { useHistory } from "react-router-dom";

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRoute({
  isAuthenticated,
  outlet,
}: ProtectedRouteProps) {
  const history = useHistory();
  if (isAuthenticated) {
    return outlet;
  } else {
    history.push("/login");
  }
}
