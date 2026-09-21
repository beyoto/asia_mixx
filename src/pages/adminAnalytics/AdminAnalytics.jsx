// AdminAnalytics page placeholder
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import api from '../../api/axios';
import './AdminAnalytics.css';

const RANGES = [
  { key: '24h', label: '24 часа' },
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
];

// Палитра для линий сравнения — намеренно разные оттенки, чтобы линии не сливались
const COMPARE_COLORS = ['#c9a05f', '#5b7c99', '#a45c5c', '#6b8f71', '#8a6fae', '#8a5a34'];

function formatTick(value, range) {
  const date = new Date(value);
  if (range === '24h') {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function AdminAnalytics() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('all');
  const [range, setRange] = useState('7d');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    api.get('/products_asiamixx/admin/all').then((res) => {
      setProducts(res.data);
    });
  }, []);

  const isComparing = compareIds.length > 0;

  useEffect(() => {
    setLoading(true);

    let request;
    if (isComparing) {
      request = api.get('/analytics_asiamixx/views-compare', {
        params: { productIds: compareIds.join(','), range },
      });
    } else if (selectedProductId === 'all') {
      request = api.get('/analytics_asiamixx/views-summary', { params: { range } });
    } else {
      request = api.get('/analytics_asiamixx/views', { params: { productId: selectedProductId, range } });
    }

    request
      .then((res) => setData(res.data))
      .catch((err) => console.error('Ошибка загрузки аналитики:', err))
      .finally(() => setLoading(false));
  }, [selectedProductId, range, compareIds]);

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Список товаров для чек-листа сравнения, отсортированный по популярности
  const sortedProducts = [...products].sort(
    (a, b) => (b.views_count || 0) - (a.views_count || 0)
  );

  const dataKey = selectedProductId === 'all' ? 'total_views' : 'views_count';
  const lineLabel = selectedProductId === 'all' ? 'Все товары' : 'Просмотров';

  return (
    <div className="admin-analytics">
      <h1>Просмотры товаров</h1>

      <div className="admin-analytics__controls">
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="admin-analytics__select"
          disabled={isComparing}
        >
          <option value="all">Все товары</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="admin-analytics__range-buttons">
          {RANGES.map((r) => (
            <button
              key={r.key}
              className={`admin-analytics__range-btn ${
                range === r.key ? 'admin-analytics__range-btn--active' : ''
              }`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isComparing && (
        <p className="admin-analytics__compare-note">
          Режим сравнения — выбор в списке выше временно отключён
        </p>
      )}

      <div className="admin-analytics__chart-wrap">
        {loading ? (
          <p className="admin-analytics__status">Загрузка...</p>
        ) : data.length === 0 ? (
          <p className="admin-analytics__status">Нет данных за этот период</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="captured_at"
                tickFormatter={(v) => formatTick(v, range)}
                stroke="var(--color-muted)"
                fontSize={11}
              />
              <YAxis stroke="var(--color-muted)" fontSize={11} allowDecimals={false} />
              <Tooltip
                labelFormatter={(v) => new Date(v).toLocaleString('ru-RU')}
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-ivory)',
                }}
              />
              {isComparing && <Legend />}

              {isComparing
                ? compareIds.map((id, index) => {
                    const product = products.find((p) => p.id === id);
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={String(id)}
                        name={product ? product.name : `Товар ${id}`}
                        stroke={COMPARE_COLORS[index % COMPARE_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        connectNulls
                      />
                    );
                  })
                : (
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    name={lineLabel}
                    stroke="var(--color-gold)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--color-gold)' }}
                    activeDot={{ r: 5 }}
                  />
                )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="admin-analytics__compare-list">
        <h2>Сравнить товары</h2>
        <p className="admin-analytics__compare-hint">
          Отсортировано по популярности. Отметь до 6 товаров, чтобы сравнить их на графике.
        </p>

        {sortedProducts.map((p) => (
          <label key={p.id} className="admin-analytics__compare-row">
            <input
              type="checkbox"
              checked={compareIds.includes(p.id)}
              onChange={() => toggleCompare(p.id)}
              disabled={!compareIds.includes(p.id) && compareIds.length >= 6}
            />
            <span className="admin-analytics__compare-name">{p.name}</span>
            <span className="admin-analytics__compare-count">{p.views_count || 0} просм.</span>
          </label>
        ))}
      </div>

      <p className="admin-analytics__hint">
        Совет: поверните телефон горизонтально для более детального просмотра графика
      </p>
    </div>
  );
}

export default AdminAnalytics;