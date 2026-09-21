// EditProduct page placeholder
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

import './EditProduct.css';

const CATEGORY_LABELS = {
  ring: 'Кольцо',
  bracelet: 'Браслет',
  chain: 'Цепочка',
  set: 'Набор',
};

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'ring',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/products_asiamixx/${id}`)
      .then((res) => {
        const product = res.data;

        setForm({
          name: product.name,
          description: product.description || '',
          price: product.price,
          category: product.category,
        });

        setExistingImages(product.images || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить товар');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 5);
    setNewFiles(selected);
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
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
      await api.put(`/products_asiamixx/${id}`, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
      });

      if (newFiles.length > 0) {
        const formData = new FormData();

        newFiles.forEach((file) => {
          formData.append('images', file);
        });

        await api.post(`/products_asiamixx/${id}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить изменения');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product">
        <div className="edit-product__loading">
          Загрузка товара...
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product">

      {/* Header */}
      <div className="edit-product__header">
        <button
          type="button"
          className="edit-product__back"
          onClick={() => navigate('/admin')}
        >
          <ArrowBackIcon fontSize="small" />
          Назад
        </button>

        <div>
          <span className="edit-product__label">
            Товар #{id}
          </span>

          <h1>Редактировать товар</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-product__form">

        {/* Основная информация */}
        <section className="edit-product__section">

          <div className="edit-product__section-header">
            <div>
              <h2>Основная информация</h2>
              <p>Измените данные товара</p>
            </div>
          </div>

          <div className="edit-product__fields">

            <label className="edit-product__field edit-product__field--full">
              <span>Название</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Например, Золотое кольцо"
                required
              />
            </label>

            <label className="edit-product__field edit-product__field--full">
              <span>Описание</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Описание товара..."
                rows="5"
              />
            </label>

            <label className="edit-product__field">
              <span>Цена</span>

              <div className="edit-product__price-input">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  required
                />

                <span>сом</span>
              </div>
            </label>

            <label className="edit-product__field">
              <span>Категория</span>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="ring">Кольцо</option>
                <option value="bracelet">Браслет</option>
                <option value="chain">Цепочка</option>
                <option value="set">Набор</option>
              </select>
            </label>

          </div>
        </section>

        {/* Фотографии */}
        <section className="edit-product__section">

          <div className="edit-product__section-header">
            <div>
              <h2>Фотографии</h2>
              <p>
                Текущие фотографии товара
              </p>
            </div>

            <span className="edit-product__counter">
              {existingImages.length} фото
            </span>
          </div>

          {existingImages.length > 0 ? (
            <div className="edit-product__existing-images">
              {existingImages.map((url, index) => (
                <div
                  className="edit-product__image"
                  key={index}
                >
                  <img
                    src={url}
                    alt={`${form.name} ${index + 1}`}
                  />

                  <span>
                    Фото {index + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="edit-product__no-images">
              <AddPhotoAlternateIcon />
              <span>У товара пока нет фотографий</span>
            </div>
          )}

        </section>

        {/* Новые фотографии */}
        <section className="edit-product__section">

          <div className="edit-product__section-header">
            <div>
              <h2>Добавить фотографии</h2>
              <p>
                JPEG, PNG или WEBP. Максимум 5 файлов.
              </p>
            </div>
          </div>

          <label className="edit-product__upload">

            <AddPhotoAlternateIcon />

            <span className="edit-product__upload-title">
              Выбрать фотографии
            </span>

            <span className="edit-product__upload-text">
              Нажмите, чтобы выбрать файлы
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
            />

          </label>

          {newFiles.length > 0 && (
            <div className="edit-product__new-files">

              <div className="edit-product__new-files-header">
                <span>
                  Новые фотографии
                </span>

                <span>
                  {newFiles.length} / 5
                </span>
              </div>

              {newFiles.map((file, index) => (
                <div
                  className="edit-product__file"
                  key={`${file.name}-${index}`}
                >
                  <span className="edit-product__file-name">
                    {file.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    aria-label="Удалить фотографию"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* Ошибка */}
        {error && (
          <div className="edit-product__error">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="edit-product__actions">

          <button
            type="button"
            className="edit-product__cancel"
            onClick={() => navigate('/admin')}
          >
            Отмена
          </button>

          <button
            type="submit"
            className="edit-product__save"
            disabled={submitting}
          >
            <SaveIcon fontSize="small" />

            {submitting
              ? 'Сохраняем...'
              : 'Сохранить изменения'}
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditProduct;