// ProductCard component placeholder
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from './FavoritesContext.jsx';
import './ProductCard.css';
import useEmblaCarousel from 'embla-carousel-react';

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

function ProductCard({ product }) {
  const images = product.images && product.images.length > 0 ? product.images : [];
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const handleHeartClick = (e) => {
    e.preventDefault();
    toggleFavorite(product.id);
  };

  const scrollTo = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi && emblaApi.scrollTo(index);
  };

  const scrollPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi && emblaApi.scrollPrev();
  };

  const scrollNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi && emblaApi.scrollNext();
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        {images.length > 0 ? (
          <div className="product-card__embla" ref={emblaRef}>
            <div className="product-card__embla-container">
              {images.map((src, i) => (
                <div className="product-card__embla-slide" key={i}>
                  <img src={src} alt={product.name} className="product-card__image" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="product-card__no-image">Нет фото</div>
        )}

        <button
          className={`product-card__heart ${favorite ? 'product-card__heart--active' : ''}`}
          onClick={handleHeartClick}
          aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'}>
            <path
              d="M12 21s-7-4.35-9.5-8.5C0.7 9 2 5 5.5 5c2 0 3.5 1.2 4.5 2.8C11 6.2 12.5 5 14.5 5 18 5 19.3 9 17.5 12.5 15 16.65 12 21 12 21z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        {images.length > 1 && (
          <>
            <button className="product-card__arrow product-card__arrow--prev" onClick={scrollPrev} aria-label="Предыдущее фото">
              ‹
            </button>
            <button className="product-card__arrow product-card__arrow--next" onClick={scrollNext} aria-label="Следующее фото">
              ›
            </button>

            <div className="product-card__dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`product-card__dot ${i === selectedIndex ? 'product-card__dot--active' : ''}`}
                  onClick={(e) => scrollTo(e, i)}
                  aria-label={`Фото ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{CATEGORY_LABELS[product.category] || product.category}</span>
        <h2 className="product-card__name">{product.name}</h2>
        <p className="product-card__price">{product.price} ₽</p>
      </div>
    </Link>
  );
}

export default ProductCard;