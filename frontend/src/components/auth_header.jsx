import { FaBookOpen, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function AuthHeader({ user, setPage, onLogout }) {
  return (
    <header className="header">
      <div className="header-inner">

        {/* Логотип */}
        <div className="logo" onClick={() => setPage('catalog')}>
          <div className="logo-icon">
            <FaBookOpen size={20} color="#fff" />
          </div>
          <span className="logo-title">BookHub</span>
        </div>

        {/* Кнопки справа */}
        <div className="header-actions">
          {user ? (
            <>
              <button className="header-user" onClick={() => setPage('profile')}>
                <FaUser size={15} /> {user.username}
              </button>
              <button className="btn btn-ghost" onClick={onLogout}>
                <FaSignOutAlt style={{ marginRight: 8 }} />
                Выйти
              </button>
            </>
          ) : (
            <button className="btn btn-accent" onClick={() => setPage('auth')}>
              Войти
            </button>
          )}
        </div>

      </div>
    </header>
  );
}