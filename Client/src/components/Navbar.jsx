import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="topbar">
      <div>
        <p className="topbar__eyebrow">Health Monitoring</p>
        <h1 className="topbar__title">HealthApp</h1>
      </div>

      <div className="topbar__actions">
        <div className="topbar__user">
          <span className="topbar__user-label">Signed in as</span>
          <strong>{user?.name || user?.email || "User"}</strong>
        </div>
        <Link to="/profile" className="topbar__link">
          Profile
        </Link>
        <button type="button" onClick={handleLogout} className="topbar__button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
