import { useState } from 'react';
import { FaBookOpen, FaUserPlus } from 'react-icons/fa';

export default function AuthPage({ setUser, setPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isLogin
      ? '/api/login/'
      : '/api/register/';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setUser({ id: data.user_id, username: data.username });
          setPage('catalog');
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Не удалось соединиться с сервером'));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-icon">
          {isLogin ? <FaBookOpen size={44} /> : <FaUserPlus size={44} />}
        </div>
        <h2 className="auth-title">
          {isLogin ? 'С возвращением!' : 'Присоединяйся к нам'}
        </h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            placeholder="Логин"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Пароль"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? 'Ещё нет аккаунта? ' : 'Уже есть аккаунт? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Регистрация' : 'Войти'}
          </span>
        </p>
      </div>
    </div>
  );
}