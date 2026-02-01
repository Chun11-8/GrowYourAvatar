import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EMOJIS = ['🍎', '🐶', '🦄', '🌈', '🍦', '🧸', '🐝', '🏀'];

const Counting: React.FC = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(3);
    const [emoji, setEmoji] = useState('🍎');
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Count them!');

    const generateRound = () => {
        const newCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 for small kids
        setCount(newCount);
        setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

        const others = [1, 2, 3, 4, 5, 6].filter(n => n !== newCount)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setOptions([newCount, ...others].sort(() => Math.random() - 0.5));
        setMessage(`How many ${newCount > 1 ? 'objects' : 'object'}?`);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleSelect = (num: number) => {
        if (num === count) {
            setScore(s => s + 1);
            setMessage('Perfect! 🦄');
            setTimeout(generateRound, 1000);
        } else {
            setMessage('Counting is fun, try again! 😊');
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Counting Fun</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Score: {score}
                </div>

                <div className="display-area" style={{
                    padding: '2rem',
                    background: '#FFD1DC',
                    borderRadius: '20px',
                    margin: '2rem auto',
                    maxWidth: '500px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem',
                    minHeight: '150px',
                    alignItems: 'center'
                }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} style={{ fontSize: '4rem' }}>{emoji}</div>
                    ))}
                </div>
                <p style={{ fontWeight: 800, color: '#666', marginBottom: '2rem' }}>{message}</p>

                <div className="options-grid" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {options.map((num, idx) => (
                        <button
                            key={idx}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '2.5rem', minWidth: '80px' }}
                            onClick={() => handleSelect(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Counting;
