import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Workout", path: "/workout" },
    { name: "Diet", path: "/diet" },
    { name: "Progress", path: "/dashboard" }, // Points to dashboard for now
    { name: "AI Coach", path: "/chat" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">
        FitFusion AI
      </h2>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;