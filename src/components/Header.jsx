// Header component placeholder
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from './FavoritesContext.jsx';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites } = useFavorites();

  return (
    <header className="site-header">
      <button
        className="site-header__icon-btn"
        onClick={() => setMenuOpen(true)}
        aria-label="Открыть меню"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="site-header__brand">
        <h1><Link to="/">ASIA MIXX</Link></h1>
        <p>МАГАЗИН МУЖСКОЙ ОДЕЖДЫ | МОСКВА</p>
      </div>

      <Link
        to="/favorites"
        className="site-header__icon-btn site-header__heart"
        aria-label="Избранное"
      >
        {favorites.length > 0 ? (
          <FavoriteIcon
            className="site-header__heart-icon"
            sx={{ fontSize: 22, color: 'var(--color-gold)' }}
          />
        ) : (
          <FavoriteBorderIcon
            className="site-header__heart-icon"
            sx={{ fontSize: 22 }}
          />
        )}

        {favorites.length > 0 && (
          <span className="site-header__badge">{favorites.length}</span>
        )}
      </Link>

      {menuOpen && (
        <div className="site-header__overlay" onClick={() => setMenuOpen(false)}>
          <nav className="site-header__menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="site-header__close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Закрыть меню"
            >
              ✕
            </button>
            <Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link>
            <Link to="/favorites" onClick={() => setMenuOpen(false)}>Избранное</Link>
            <Link to="/contacts" onClick={() => setMenuOpen(false)}>Контакты</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;