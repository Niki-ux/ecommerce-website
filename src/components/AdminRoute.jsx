// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // Getting user from localStorage instead of AuthContext
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Redirect standard users to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;