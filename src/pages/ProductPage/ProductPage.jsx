// ProductPage placeholder
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import './ProductPage.css';
import useEmblaCarousel from 'embla-carousel-react';

import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';


function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setActiveImage(emblaApi.selectedScrollSnap());
  }, [emblaApi]);



  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get(`/products_asiamixx/${id}`)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(0);
      })
      .catch((err) => {
        console.error('Ошибка загрузки товара:', err);
        setError('Товар не найден');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ASIA MIXX`;
    }
  }, [product]);


  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [];

  const productUrl = window.location.href;

  const whatsappUrl = `https://wa.me/79260316300?text=${encodeURIComponent(
    `Здравствуйте! Интересует товар "${product.name}" (${product.price} ₽).

🔗 ${productUrl}`
  )}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Интересует товар "${product.name}" — ${product.price} ₽`,
          url: productUrl,
        });
      } catch (err) {
        // Пользователь просто закрыл системное меню
        if (err.name !== 'AbortError') {
          console.error('Ошибка открытия меню поделиться:', err);
        }
      }
    } else {
      setShareModal(true);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Не удалось скопировать ссылку:', err);
    }
  };


  return (
    <div className="product-page">

      <Link to="/" className="product-page__back">
        &larr; Назад в каталог
      </Link>

      <div className="product-page__content">

        {/* ================= ГАЛЕРЕЯ ================= */}

        <div className="product-page__gallery">

          {images.length > 0 ? (
            <div className="product-page__main-image-wrap">

              <div
                className="product-page__embla"
                ref={emblaRef}
              >
                <div className="product-page__embla-container">

                  {images.map((img, index) => (
                    <div
                      className="product-page__embla-slide"
                      key={index}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="product-page__main-image"
                      />
                    </div>
                  ))}

                </div>
              </div>

              {images.length > 1 && (
                <div className="product-page__dots">

                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`product-page__dot ${index === activeImage
                        ? 'product-page__dot--active'
                        : ''
                        }`}
                      onClick={() => emblaApi?.scrollTo(index)}
                      aria-label={`Фото ${index + 1}`}
                    />
                  ))}

                </div>
              )}

            </div>
          ) : (
            <div className="product-page__no-image">
              Нет фото
            </div>
          )}

        </div>

        {/* ================= ИНФОРМАЦИЯ ================= */}

        <div className="product-page__info">

          <span className="product-page__category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="product-page__price">
            {product.price} ₽
          </p>

          {product.description && (
            <p className="product-page__description">
              {product.description}
            </p>
          )}

          <p className="product-page__in-stock">
            ✓ В наличии
          </p>

          <div className="product-page__actions">

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="product-page__contact-btn"
            >
              Написать в WhatsApp
            </a>

            <button
              type="button"
              className="product-page__share-btn"
              onClick={handleShare}
            >
              <ShareIcon fontSize="small" />
              Поделиться
            </button>

          </div>

        </div>

      </div>

      {/* ================= SHARE MODAL ================= */}

      {shareModal && (
        <div
          className="share-modal"
          onClick={() => setShareModal(false)}
        >
          <div
            className="share-modal__content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="share-modal__close"
              onClick={() => setShareModal(false)}
              aria-label="Закрыть"
            >
              <CloseIcon />
            </button>

            <h2>Поделиться</h2>

            <p>
              Отправьте ссылку на этот товар
            </p>

            <button
              className="share-modal__copy"
              onClick={copyLink}
            >
              <ContentCopyIcon fontSize="small" />

              {copied
                ? 'Ссылка скопирована'
                : 'Скопировать ссылку'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default ProductPage;