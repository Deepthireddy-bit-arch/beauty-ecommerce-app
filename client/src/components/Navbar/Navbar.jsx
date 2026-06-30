import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestions, clearSuggestions } from "../../redux/slices/searchSlice";
import { loginReset } from "../../redux/slices/loginSlice";
import "./navbar.css";
import { fetchCart } from "../../redux/reducers/thunks/cartThunks";
import { fetchWishlist } from "../../redux/reducers/thunks/wishlistActions";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suggestions } = useSelector((state) => state.searchReducer);
  const user = useSelector((s) => s.login?.user ?? null);
  // const cartCount = useSelector((s) =>
  //   s.cart.items.reduce((a, i) => a + i.qty, 0)
  // );
  const cartCount = useSelector((s) => s.cart.items.length);
  const wishCount = useSelector((s) => s.wishlist.items.length);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
  useEffect(() => {
  if (user) {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }
}, [user, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) dispatch(fetchSuggestions(searchQuery));
      else dispatch(clearSuggestions());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const fn = (e) => {
      if (!e.target.closest(".profile-wrap")) setDropdownOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const requireAuth = (path) => {
    setMenuOpen(false);
    if (!user) navigate("/login");
    else navigate(path);
  };

  const handleLogout = () => {
    dispatch(loginReset());
    localStorage.removeItem("shophub_user");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    dispatch(clearSuggestions());
    setSearchOpen(false);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "Collections", to: "/collections" },
    { label: "Brands", to: "/brands" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column" }}>
              <div className="search-input-row">
                <input
                  autoFocus
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories…"
                />
                <button type="submit" className="btn-purple search-submit">
                  🔍
                </button>
              </div>
              {suggestions?.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      className="search-suggestion-item"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(item.name)}`);
                        setSearchOpen(false);
                        dispatch(clearSuggestions());
                      }}
                    >
                      🔍 {item.name}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Logo — left */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">S</div>
            <div>
              <div className="nav-logo-name">Shop<span>Hub</span></div>
              <div className="nav-logo-sub">Beauty Atelier</div>
            </div>
          </Link>

          {/* Nav links — absolutely centered */}
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Actions — right */}
          <div className="nav-actions">

            <button className="nav-icon-btn nav-search-btn" onClick={() => setSearchOpen(true)}>
              🔍 <span>Search</span>
            </button>

            <button className="nav-icon-btn nav-cart-btn" onClick={() => requireAuth("/cart")}>
              🛒
              {user && cartCount > 0 && (
                <span className="nav-badge nav-badge--purple">{cartCount}</span>
              )}
            </button>

            <button className="nav-icon-btn nav-wish-btn" onClick={() => requireAuth("/wishlist")}>
              ♡
              {user && wishCount > 0 && (
                <span className="nav-badge nav-badge--purple">{wishCount}</span>
              )}
            </button>

            {user ? (
              <div className="profile-wrap">
                <button className="nav-profile-pill" onClick={() => setDropdownOpen((v) => !v)}>
                  <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <span className="nav-profile-name">{user.name?.split(" ")[0]}</span>
                  <span className={`nav-chevron${dropdownOpen ? " open" : ""}`}>▼</span>
                </button>
                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-name">{user.name}</div>
                      <div className="nav-dropdown-email">{user.email}</div>
                    </div>
                    <Link to="/profile" className="nav-dropdown-link" onClick={() => setDropdownOpen(false)}>
                      👤 My Profile
                    </Link>
                    <Link to="/orders" className="nav-dropdown-link" onClick={() => setDropdownOpen(false)}>
                      📦 My Orders
                    </Link>
                    <div className="nav-dropdown-divider" />
                    <button className="nav-dropdown-logout" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-signin">Sign In</Link>
                <Link to="/register" className="nav-join">Join Free</Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button className="nav-hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <span className={`nav-hamburger-icon${menuOpen ? " is-open" : ""}`}>
              <span />
              <span />
              {!menuOpen && <span />}
            </span>
          </button>

        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map((l) => (
          <Link key={l.label} to={l.to} className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="nav-mobile-divider" />
        <div className="nav-mobile-icon-row">
          <button className="nav-mobile-icon-btn" onClick={() => { setSearchOpen(true); setMenuOpen(false); }}>
            🔍 <span>Search</span>
          </button>
          <button className="nav-mobile-icon-btn" onClick={() => requireAuth("/cart")}>
            🛒 <span>Cart {user && cartCount > 0 && `(${cartCount})`}</span>
          </button>
          <button className="nav-mobile-icon-btn" onClick={() => requireAuth("/wishlist")}>
            ♡ <span>Wishlist {user && wishCount > 0 && `(${wishCount})`}</span>
          </button>
        </div>
        <div className="nav-mobile-divider" />
        {user ? (
          <div className="nav-mobile-user">
            <div className="nav-mobile-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div className="nav-mobile-user-info">
              <div className="nav-mobile-user-name">{user.name}</div>
              <div className="nav-mobile-user-email">{user.email}</div>
            </div>
          </div>
        ) : null}
        <div className="nav-mobile-actions">
          {user ? (
            <>
              <Link to="/profile" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
              <Link to="/orders" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
              <button className="nav-mobile-logout" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <div className="nav-mobile-auth-btns">
              <Link to="/login" className="nav-signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="nav-join" onClick={() => setMenuOpen(false)}>Join Free</Link>
            </div>
          )}
        </div>
      </div>

      {menuOpen && <div className="nav-mobile-backdrop" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;