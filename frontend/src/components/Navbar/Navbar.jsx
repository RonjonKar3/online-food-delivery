import React, { useContext, useState } from "react";
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, isLoggedIn, setIsLoggedIn } = useContext(StoreContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Swift Meal Logo" className="logo" />
      </Link>

      {/* Menu Links */}
      <ul className="navbar-menu">
        <li>
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
            Menu
          </a>
        </li>
        <li>
          <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>
            Mobile App
          </a>
        </li>
        <li>
          <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
            Contact Us
          </a>
        </li>
      </ul>

      {/* Right Side - Search, Cart, Profile/Login */}
      <div className="navbar-right">
        <div className="cart-icon-wrapper">
          <Link to="/cart" aria-label="Cart">
            <img src={assets.basket_icon} alt="Cart Icon" className="basket-icon" />
            {getTotalCartAmount() > 0 && <div className="dot"></div>}
          </Link>
        </div>

        {/* Logged In / Logged Out Toggle */}
        {isLoggedIn ? (
          <div className="profile-wrapper">
            <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
            <div className="profile-dropdown">
              {/* ✅ Updated Link from /order to /myorders */}
              <Link to="/myorders" className="dropdown-item">
                <img src={assets.bag_icon} alt="Orders Icon" className="dropdown-icon" />
                Orders
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                <img src={assets.logout_icon} alt="Logout Icon" className="dropdown-icon" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} aria-label="Sign In">
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
