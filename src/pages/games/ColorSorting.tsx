import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = [
    { name: 'Red', hex: '#FFADAD', emoji: '🍎' },
    { name: 'Blue', hex: '#A0C4FF', emoji: '💎' },
    { name: 'Green', hex: '#CAFFBF', emoji: '🌳' },
];

const ColorSorting: React.FC = () => {
    const navigate = useNavigate();
    const [currentItem, setCurrentItem] = useState(COLORS[0]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Put the item in the right basket!');

    const generateRound = () => {
        const item = COLORS[Math.floor(Math.random() * COLORS.length)];
        setCurrentItem(item);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleSort = (colorName: string) => {
        if (colorName === currentItem.name) {
            setScore(s => s + 1);
            setMessage('Correct! 🌈');
            setTimeout(generateRound, 800);
        } else {
            setMessage('Oops! Try again! ❤️');
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Color Sorter</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Items Sorted: {score}
                </div>

                <div className="item-to-sort" style={{ margin: '2rem 0' }}>
                    <div style={{ fontSize: '6rem', animation: 'bounce 2s infinite' }}>{currentItem.emoji}</div>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{message}</p>
                </div>

                <div className="baskets" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginTop: '3rem'
                }}>
                    {COLORS.map((c) => (
                        <div
                            key={c.name}
                            onClick={() => handleSort(c.name)}
                            className="clay-card"
                            style={{
                                background: c.hex,
                                width: '120px',
                                height: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '6px solid white'
                            }}
                        >
                            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                {c.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
};

export default ColorSorting;
