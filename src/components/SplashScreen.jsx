// SplashScreen component placeholder
import { useState, useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen({ children }) {
  const alreadyShown = sessionStorage.getItem('splashShown') === 'true';

  const [visible, setVisible] = useState(!alreadyShown);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (alreadyShown) return;

    const fadeTimer = setTimeout(() => setFadingOut(true), 1100);
    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 1450);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [alreadyShown]);

  return (
    <>
      {visible && (
        <div className={`splash-screen ${fadingOut ? 'splash-screen--fade-out' : ''}`}>
          <h1 className="splash-screen__brand">ASIA MIXX</h1>
        </div>
      )}
      {children}
    </>
  );
}

export default SplashScreen;