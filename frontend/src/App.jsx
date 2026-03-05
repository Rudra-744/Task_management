import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <Loading fullScreen message="Checking authentication..." />;

  // If not logged in at all
  if (!user) return <Navigate to="/auth" />;

  // If logged in, check if their role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect standard users to tasks, and admins/PMs to dashboard if they wander into the wrong place
    if (user.role === "employee") {
      return <Navigate to="/tasks" />;
    } else {
      return <Navigate to="/admin" />;
    }
  }

  // Authorized!
  return children;
};

// For preventing a logged-in user from seeing the login page again
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullScreen message="Loading..." />;

  // If user is already logged in, redirect them based on their role
  if (user) {
    if (user.role === "admin" || user.role === "project_manager") {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/tasks" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast container for global notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <TaskPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "project_manager"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect root based on login status */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Catch all 404 handler - fallback to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
