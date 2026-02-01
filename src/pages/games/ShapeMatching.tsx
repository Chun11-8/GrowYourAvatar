import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SHAPES = [
    { type: 'square', emoji: '⬛', color: '#FFADAD' },
    { type: 'circle', emoji: '⚫', color: '#A0C4FF' },
    { type: 'triangle', emoji: '🔺', color: '#CAFFBF' },
    { type: 'star', emoji: '⭐', color: '#FDFFB6' },
];

const ShapeMatching: React.FC = () => {
    const navigate = useNavigate();
    const [target, setTarget] = useState(SHAPES[0]);
    const [options, setOptions] = useState<typeof SHAPES>([]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Match the shape!');

    const generateRound = () => {
        const newTarget = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setTarget(newTarget);
        setOptions([...SHAPES].sort(() => Math.random() - 0.5));
        setMessage(`Find the ${newTarget.type}!`);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleSelect = (shape: typeof SHAPES[0]) => {
        if (shape.type === target.type) {
            setScore(s => s + 1);
            setMessage('Great Job! ✨');
            setTimeout(generateRound, 1000);
        } else {
            setMessage('Try again! ❤️');
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Shape Matcher</h2>
                <div style={{ clear: 'both' }}></div>

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
