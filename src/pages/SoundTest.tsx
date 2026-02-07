import React from 'react';
import { useNavigate } from 'react-router-dom';
import { soundManager } from '../utils/SoundManager';

const SoundTest: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            background: '#f0f0f0'
        }}>
            <h1>🔊 Sound Test</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => soundManager.playCorrect()}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                    ✅ Correct
                </button>
                <button
                    onClick={() => soundManager.playWrong()}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#F44336', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                    ❌ Wrong
                </button>
                <button
                    onClick={() => soundManager.playClick()}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#2196F3', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                    🖱️ Click
                </button>
                <button
                    onClick={() => soundManager.playWin()}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#FFC107', color: 'black', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                    🏆 Win
                </button>
                <button
                    onClick={() => soundManager.playGameOver()}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', background: '#607D8B', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                    💀 Game Over
                </button>
            </div>
            <button
                onClick={() => navigate('/')}
                style={{ marginTop: '30px', padding: '10px 20px', background: 'transparent', border: '2px solid #333', borderRadius: '5px', cursor: 'pointer' }}
            >
                Back to Home
            </button>
        </div>
    );
};

export default SoundTest;
