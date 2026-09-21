// AdminLogin page placeholder
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data.token);
      navigate('/admin');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Неверный логин или пароль');
      } else {
        setError('Ошибка сервера, попробуй позже');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <h1>Вход для администратора</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;