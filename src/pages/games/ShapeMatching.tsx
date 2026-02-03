import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

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
            <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="clay-container" style={{ background: '#fff' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Over! 🎉</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You scored {score} out of {maxRounds}!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="clay-button" onClick={resetGame}>Play Again</button>
                        <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}>Back to Hub</button>
                    </div>
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
