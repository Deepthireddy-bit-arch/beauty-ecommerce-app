import React from 'react';

const Navbar = ({ activePage, onNavigate }) => {
  return (
    <nav className="app-navbar">
      <a className="navbar-brand" href="/" onClick={() => onNavigate('checkout')}>
        Shop<span>Hub</span>
      </a>
      <div className="nav-links">
        <button
          className={`nav-link-btn ${activePage === 'checkout' ? 'active' : ''}`}
          onClick={() => onNavigate('checkout')}
        >
          Checkout
        </button>
        <button
          className={`nav-link-btn ${activePage === 'myorders' ? 'active' : ''}`}
          onClick={() => onNavigate('myorders')}
        >
          My Orders
        </button>
      </div>
    </nav>
  );
};

export default Navbar;