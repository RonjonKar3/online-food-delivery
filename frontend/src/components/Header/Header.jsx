import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-contents">
        <h2>Order Your Favourite Food Here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our menu
          offers something for every palate, ensuring a memorable dining
          experience filled with rich flavors, vibrant textures, and exceptional
          presentation.
        </p>
        <button
          onClick={() => window.location.href = '/menu'} // Update with your actual link
          aria-label="View menu"
        >
          View Menu
        </button>
      </div>
    </header>
  );
};

export default Header;
