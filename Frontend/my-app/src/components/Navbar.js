import { NavLink } from "react-router-dom"; 
import logo from "../assets/logo.png";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="pro-navbar">
      <div className="navbar-left">
        <img src={logo} alt="AgriSmart Logo" className="nav-logo-img" />

        <ul className="nav-menu">
          <li>
            <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>
              Upload
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-login active" : "nav-login")}>
          Sign In
        </NavLink>
        <NavLink to="/signup" className={({ isActive }) => (isActive ? "nav-join active" : "nav-join")}>
          Join
        </NavLink>
      </div>
    </nav>
  );
}