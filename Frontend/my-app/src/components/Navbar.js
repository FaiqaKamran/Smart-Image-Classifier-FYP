import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiUser, FiLogOut } from "react-icons/fi"; 
import logo from "../assets/logo.png";
import "../App.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  //  Login status check karein
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed.user || parsed);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    window.addEventListener("storage", checkUser);
    // Custom event (login ke baad fire hoga)
    window.addEventListener("userLogin", checkUser);
    
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userLogin", checkUser);
    };
  }, []);

  //  Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    setUser(null);
    setShowDropdown(false);
    navigate("/home");
  };

  return (
    <nav className="pro-navbar">
      <div className="navbar-left">
        <img src={logo} alt="AgriSmart Logo" className="nav-logo-img" />
        <ul className="nav-menu">
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/upload">Upload</NavLink></li>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        </ul>
      </div>

      <div className="navbar-right">
        {user ? (
          //  User logged in - Profile icon + naam
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="user-avatar">
              <FiUser />
            </div>
            <span className="user-name">
              {user.fullName?.split(" ")[0] || user.username || "User"}
            </span>
            {showDropdown && (
              <div className="user-dropdown">
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          //  User logged out - Sign In / Join
          <>
            <NavLink to="/login" className="nav-login">Sign In</NavLink>
            <NavLink to="/signup" className="nav-join">Join</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}