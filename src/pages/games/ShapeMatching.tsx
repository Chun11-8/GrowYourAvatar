import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const SHAPES = [
    { type: 'square', emoji: '⬛', color: '#FFADAD' },
    { type: 'circle', emoji: '⚫', color: '#A0C4FF' },
    { type: 'triangle', emoji: '🔺', color: '#CAFFBF' },
    { type: 'star', emoji: '⭐', color: '#FDFFB6' },
];

const ShapeMatching: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);

    const [target, setTarget] = useState(SHAPES[0]);
    const [options, setOptions] = useState<typeof SHAPES>([]);

    const [message, setMessage] = useState('Match the shape!');

    const generateRound = () => {
        const newTarget = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setTarget(newTarget);
        setOptions([...SHAPES].sort(() => Math.random() - 0.5));
        setMessage(`Find the ${newTarget.type}!`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (shape: typeof SHAPES[0]) => {
        if (shape.type === target.type) {
            setMessage('Great Job! ✨');
            recordSuccess();
        } else {
            setMessage('Try again! ❤️');
        }
    };

    if (isGameOver) {
        return (
            <div
                className="game-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/avatar-view', { state: { avatarId } })}
            >
                <div className="clay-container" style={{
                    background: '#fff',
                    padding: '30px',
                    maxWidth: '90%',
                    width: '500px',
                    textAlign: 'center',
                    borderRadius: '20px',
                    animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <img
                        src={congratulations}
                        alt="Congratulations"
                        style={{
                            width: '100%',
                            borderRadius: '15px',
                            marginBottom: '20px',
                            border: '4px solid #FFD1DC'
                        }}
                    />

                    <h2 style={{ color: '#FF6B6B', fontSize: '2rem', marginBottom: '10px' }}>
                        Congratulation! 🎉
                    </h2>

                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '20px', lineHeight: '1.5' }}>
                        You have completed the mission and here is your rewards!
                    </p>

                    <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>
                        🍎
                    </div>

                    <p style={{ fontSize: '1rem', color: '#888' }}>
                        (Tap anywhere to collect)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })} style={{ marginRight: 'auto' }}>← Back</button>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Shape Matcher</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Score: {score}
                </div>

                <div className="target-area" style={{
                    padding: '2rem',
                    background: '#f0f0f0',
                    borderRadius: '20px',
                    margin: '2rem auto',
                    maxWidth: '300px',
                    border: '5px dashed #ccc'
                }}>
                    <div style={{ fontSize: '5rem', opacity: 0.3 }}>{target.emoji}</div>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{message}</p>
                </div>

                <div className="options-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    {options.map((shape, idx) => (
                        <button
                            key={idx}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '3rem', padding: '1rem' }}
                            onClick={() => handleSelect(shape)}
                        >
                            {shape.emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShapeMatching;
