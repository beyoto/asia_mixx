// Footer component placeholder
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <h3>ASIA MIXX</h3>
          <p>Мужская одежда для уверенного образа</p>
        </div>

        <nav className="site-footer__links">
          <Link to="/">Главная</Link>
          <Link to="/favorites">Избранное</Link>
        </nav>

        <div className="site-footer__contacts">
          <a href="tel:+79260316300">
            <PhoneIcon fontSize="small" />
            +7 926 031-63-00
          </a>
          <a href="https://wa.me/79260316300" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon fontSize="small" />
            WhatsApp
          </a>
          <a href="https://www.instagram.com/asiamixx_man/" target="_blank" rel="noopener noreferrer">
            <InstagramIcon fontSize="small" />
            Instagram
          </a>
          <a href="">
            <PlaceIcon fontSize="small" />
            2ГИС
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {year} ASIA MIXX. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;