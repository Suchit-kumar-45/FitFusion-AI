import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div>
        <h1>Welcome {user?.name}</h1>

        <p>Smart workouts. Smarter nutrition. Powered by AI.</p>
      </div>

      <div className="navbar-actions">
        <button 
          className="profile-btn"
          onClick={() => navigate('/profile')}
          title="View Profile"
        >
          👤 Profile
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
