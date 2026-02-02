import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Sidebar.css";
import authContext from "../context/auth/authContext";

export default function Sidebar() {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setSidebarOpen(false);
  };

  return (
    <>
      {/* ===== Mobile Navbar ===== */}
      <nav className="mobile-navbar d-md-none">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <span className="navbar-title">
          {user?.name ? user.name : "Admin"} Dashboard
        </span>
      </nav>

      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        
        {/* Mobile Header */}
        <div className="sidebar-header d-md-none">
          <h5>Admin Panel</h5>
          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-links">
          <Link to="/" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          <Link to="/men" onClick={() => setSidebarOpen(false)}>Men</Link>
          <Link to="/women" onClick={() => setSidebarOpen(false)}>Women</Link>
          <Link to="/Customerview" onClick={() => setSidebarOpen(false)}>Customers</Link>
          <Link to="/Contactview" onClick={() => setSidebarOpen(false)}>Contact</Link>
        </nav>

        {/* ===== AUTH SECTION (ALWAYS AT BOTTOM) ===== */}
        <div className="sidebar-auth">
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setSidebarOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setSidebarOpen(false)}>
                Signup
              </Link>
            </>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

      </aside>

 
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
