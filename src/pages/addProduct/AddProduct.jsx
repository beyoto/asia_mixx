import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './AddProduct.css';

// Категории соответствуют CHECK-ограничению в таблице products_asiamixx
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

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'tshirt',
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const newSelected = Array.from(e.target.files);
    const combined = [...files, ...newSelected].slice(0, 5); // не больше 5 суммарно
    setFiles(combined);

    const newPreviews = combined.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price) {
      setError('Название и цена обязательны');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Создаём товар — эндпоинт нового магазина
      const productRes = await api.post('/products_asiamixx', {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
      });

      const newProductId = productRes.data.id;

      // 2. Загружаем изображения — тоже через products_asiamixx
      if (files.length > 0) {
        const formData = new FormData();

        files.forEach((file) => {
          formData.append('images', file);
        });

        await api.post(
          `/products_asiamixx/${newProductId}/images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(
        'Не удалось создать товар. Проверь данные и попробуй снова.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <h1 className="add-product-title">Добавить товар</h1>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Например, Худи Basic Black"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Материал, посадка, особенности..."
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Цена</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images">Фото товара (до 5 шт.)</label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {previews.length > 0 && (
          <div className="preview-grid">
            {previews.map((src, index) => (
              <div className="preview-item" key={src}>
                <img src={src} alt={`Превью ${index + 1}`} />
                <button
                  type="button"
                  className="preview-remove"
                  onClick={() => removeFile(index)}
                  aria-label="Убрать фото"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? 'Сохраняем...' : 'Добавить товар'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;