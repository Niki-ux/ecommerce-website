// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Update this path to wherever your auth state lives

const AdminRoute = ({ children }) => {
  // Replace this with how you actually get the user in your app
  // const { user } = useAuth(); 
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