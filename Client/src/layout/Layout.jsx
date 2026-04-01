import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useAuth from "../context/authContext";
import "../styles/navbar.css";

const Layout = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__content">
        <Navbar />
        <div className="app-shell__page">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
