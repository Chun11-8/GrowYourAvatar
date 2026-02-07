import React from 'react';
import { useNavigate } from 'react-router-dom';
import landingHero from '../assets/landing-hero.png'; // Assuming user places image here

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{
      position: 'fixed', // Fixed to ignore parent padding/margins
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      backgroundColor: '#E1F5FE',
      zIndex: 9999, // Ensure it sits on top of everything
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Background Image / Hero */}
      <div style={{
        flex: '1',
        backgroundImage: `url(${landingHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Subtle Gradient Overlay for Text Readability if needed */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(225, 245, 254, 0) 60%, rgba(225, 245, 254, 1) 100%)'
        }}></div>
      </div>

      {/* Content Area - Rounded Card appearing from bottom */}
      <div style={{
        flex: '0 0 auto',
        padding: '30px 24px 50px', // Extra bottom padding for safe area
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        borderTopLeftRadius: '35px',
        borderTopRightRadius: '35px',
        marginTop: '-40px', // Pull up to overlap image
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)',
        zIndex: 2,
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 8vw, 3rem)',
          color: '#0288D1',
          marginBottom: '8px',
          marginTop: '10px',
          textAlign: 'center',
          lineHeight: 1.1,
          fontFamily: '"Fredoka", sans-serif',
          fontWeight: 700
        }}>
          Grow Your<br />Avatar
        </h1>

        <p style={{
          color: '#546E7A',
          fontSize: '1.1rem',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: 1.5,
          maxWidth: '280px',
          fontWeight: 500
        }}>
          Play games, earn treats, and watch your friend grow! 🌟
        </p>

        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '100%'
        }}>
          <button
            onClick={() => navigate('/select-avatar')}
            style={{
              width: '100%',
              backgroundColor: '#039BE5',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '18px',
              fontSize: '1.2rem',
              fontWeight: 700,
              boxShadow: '0 4px 0 #0277BD, 0 8px 20px rgba(3, 155, 229, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate('/create-avatar')}
            style={{
              width: '100%',
              backgroundColor: '#E1F5FE',
              color: '#0288D1',
              border: '2px solid #81D4FA',
              borderRadius: '20px',
              padding: '18px',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
