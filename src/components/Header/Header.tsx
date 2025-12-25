import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

interface HeaderProps {
  onMenuToggle: () => void;
}

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path
      d="M9 3.5a5.5 5.5 0 015.5 5.5 5.47 5.47 0 01-1.1 3.3l3.3 3.2-1.4 1.4-3.3-3.2A5.5 5.5 0 119 3.5zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
      fill="currentColor"
    />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path
      d="M6 8l4 4 4-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <button className="header__menu-toggle" onClick={onMenuToggle}>
            ☰
          </button>

          <div className="header__logo" onClick={() => navigate("/dashboard")}>
            <img src="/logo.svg" alt="Lendsqr" />
          </div>

          <div className="header__search">
            <input
              type="text"
              className="header__search-input"
              placeholder="Search for anything"
            />
            <button className="header__search-button">
              <span className="header__search-button-icon">
                <SearchIcon />
              </span>
            </button>
          </div>
        </div>

        <div className="header__right">
          <a href="#docs" className="header__docs">
            Docs
          </a>

          <div className="header__notification" aria-label="Notifications">
            <img src="/icons/bell.svg" alt="Notifications" />
          </div>

          <div className="header__profile">
            <div className="header__profile-avatar">
              <img src="/avatar.svg" alt="User" />
            </div>
            <span className="header__profile-name">Adedeji</span>
            <span className="header__profile-dropdown">
              <ChevronDown />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
