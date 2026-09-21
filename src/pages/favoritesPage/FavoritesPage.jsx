// FavoritesPage placeholder
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useFavorites } from '../../components/FavoritesContext.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import Header from '../../components/Header.jsx';
import TrustBadges from '../../components/TrustBadges.jsx';
import Footer from '../../components/Footer.jsx';

function FavoritesPage() {
  const { favorites, syncFavorites } = useFavorites();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Избранное — ASIA MIXX';
  }, []);

  useEffect(() => {
    api
      .get('/products_asiamixx')
      .then((res) => {
        setAllProducts(res.data);
        syncFavorites(res.data);
      })
      .catch((err) => console.error('Ошибка загрузки товаров:', err))
      .finally(() => setLoading(false));
  }, []);

  const favoriteProducts = allProducts.filter((p) => favorites.includes(p.id));

  console.log('favorites:', favorites);
  console.log('allProducts:', allProducts);
  console.log('favoriteProducts:', favoriteProducts);

  return (
    <>
      <div className="home-page">
        <Header />
        <TrustBadges />
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Избранное</h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : favoriteProducts.length === 0 ? (
          <p>
            Пока пусто. <Link style={{ textDecoration: 'underline' }} to="/">Перейти в каталог</Link>
          </p>
        ) : (
          <div className="products-grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default FavoritesPage;