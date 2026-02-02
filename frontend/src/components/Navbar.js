import { Link, useNavigate } from 'react-router-dom';
import React from "react";
import '../App.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar bg-white fixed-top" style={{ zIndex: 1050 }}>

      <div className="container-fluid px-3 px-lg-4">

        <ul className="navbar-nav flex-row gap-4 d-none d-lg-flex">
          <li className="nav-item"><Link to="/women" className="nav-link">WOMEN</Link></li>
          <li className="nav-item"><Link to="/men" className="nav-link">MEN</Link></li>
          <li className="nav-item"><Link to="/about" className="nav-link">ABOUT</Link></li>
          <li className="nav-item"><Link to="/contact" className="nav-link">CONTACT</Link></li>
        </ul>

        {!menuOpen && (
          <div className="position-absolute start-50 translate-middle-x d-none d-lg-block">
            <Link
              to="/"
              className="navbar-brand fw-light m-0"
              style={{ letterSpacing: "4px", fontWeight: 300 }}
            >
              MINIMAL
            </Link>
          </div>
        )}

        <ul className="navbar-nav flex-row gap-3 d-none d-lg-flex align-items-center">
          {!localStorage.getItem('token') ? (
            <>
              <Link to="/login" className="btn btn mx-2">Login</Link>
              <Link to="/signup" className="btn btn mx-2">Signup</Link>
            </>
          ) : (
            <button className="btn btn" onClick={handleLogout}>Logout</button>
          )}

          <li className="nav-item">
            <Link to="/cart" className="nav-link"><i className="bi bi-bag"></i></Link>
          </li>
        </ul>

        <div className="d-flex d-lg-none w-100 justify-content-between align-items-center py-2 px-3" style={{ minHeight: '56px' }}>
          <button
            className="navbar-toggler border-0 p-0"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {!menuOpen && (
            <Link
              to="/"
              className="navbar-brand fw-light m-0"
              style={{ letterSpacing: '4px', fontWeight: 300, lineHeight: '1' }}
            >
              MINIMAL
            </Link>
          )}

          <Link to="/cart" className="nav-link p-0 m-0">
            <i className="bi bi-bag fs-5"></i>
          </Link>
        </div>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav text-center  gap-3 d-lg-none">
            <li><Link to="/women" className="nav-link">WOMEN</Link></li>
            <li><Link to="/men" className="nav-link">MEN</Link></li>
            <li><Link to="/about" className="nav-link">ABOUT</Link></li>
            <li><Link to="/contact" className="nav-link">CONTACT</Link></li>

            {!localStorage.getItem('token') ? (
              <>
                <Link to="/login" className="btn btn mx-2">Login</Link>
                <Link to="/signup" className="btn btn mx-2">Signup</Link>
              </>
            ) : (
              <button className="btn btn" onClick={handleLogout}>Logout</button>
            )}
          </ul>
        </div>

      </div>
    </nav>
  );
}
