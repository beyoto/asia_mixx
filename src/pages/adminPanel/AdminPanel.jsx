import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LogoutIcon from '@mui/icons-material/Logout';
import './AdminPanel.css';

const CATEGORY_LABELS = {
  tshirt: 'Футболка',
  shirt: 'Рубашка',
  hoodie: 'Худи',
  jacket: 'Куртка',
  jeans: 'Джинсы',
  pants: 'Брюки',
  shorts: 'Шорты',
  shoes: 'Обувь',
  accessory: 'Аксессуар',
  set: 'Набор',
};

function AdminPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = () => {
    setLoading(true);
    api
      .get('/products_asiamixx/admin/all')
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить товары');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Панель администратора';
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleActive = async (product) => {
    try {
      await api.put(`/products_asiamixx/${product.id}`, { is_active: !product.is_active });
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Не удалось изменить статус товара');
    }
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(`Точно удалить "${product.name}"? Это необратимо.`);
    if (!confirmed) return;

    try {
      await api.delete(`/products_asiamixx/${product.id}`);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Не удалось удалить товар');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1>Панель администратора</h1>
        <button className="admin-panel__logout" onClick={handleLogout}>
          <LogoutIcon fontSize="small" />
          Выйти
        </button>
        <button onClick={() => navigate('/admin/analytics')}>Аналитика</button>
      </div>

      <button className="admin-panel__add-btn" onClick={() => navigate('/admin/add')}>
        <AddIcon fontSize="small" />
        Добавить товар
      </button>

      {loading && <p className="admin-panel__status">Загрузка...</p>}
      {error && <p className="admin-panel__status admin-panel__status--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-list">
          <div className="admin-list__header">
            <span>Фото</span>
            <span>Товар</span>
            <span>Цена</span>
            <span>Статус</span>
            <span>Действия</span>
          </div>

          {products.map((product) => (
            <div className="admin-list__row" key={product.id}>
              <div className="admin-list__photo">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="admin-list__no-photo">Нет фото</div>
                )}
              </div>

              <div className="admin-list__info">
                <span className="admin-list__category">
                  {CATEGORY_LABELS[product.category] || product.category}
                </span>
                <span className="admin-list__name">{product.name}</span>
              </div>

              <div className="admin-list__price">{product.price} ₽</div>

              <div className="admin-list__status">
                <span
                  className={`admin-list__badge ${product.is_active ? 'admin-list__badge--active' : 'admin-list__badge--hidden'
                    }`}
                >
                  {product.is_active ? 'Активен' : 'Скрыт'}
                </span>
              </div>

              <div className="admin-list__actions">
                <button
                  className="admin-list__action-btn"
                  onClick={() => navigate(`/admin/edit/${product.id}`)}
                  aria-label="Редактировать"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  className="admin-list__action-btn"
                  onClick={() => toggleActive(product)}
                  aria-label={product.is_active ? 'Скрыть' : 'Показать'}
                >
                  {product.is_active ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </button>
                <button
                  className="admin-list__action-btn admin-list__action-btn--danger"
                  onClick={() => deleteProduct(product)}
                  aria-label="Удалить"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;