// TrustBadges component placeholder
import GppGoodIcon from '@mui/icons-material/GppGood';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import './TrustBadges.css';

function TrustBadges() {
  return (
    <div className="trust-badges">
      <div className="trust-badge">
        <div className="trust-badge__icon">
          <GppGoodIcon />
        </div>
        <p>Гарантия качества</p>
      </div>
      <div className="trust-badge">
        <div className="trust-badge__icon">
          <LocalShippingIcon />
        </div>
        <p>Быстрая доставка</p>
      </div>
      <div className="trust-badge">
        <div className="trust-badge__icon">
          <WorkspacePremiumIcon />
        </div>
        <p>Большой выбор</p>
      </div>
    </div>
  );
}

export default TrustBadges;