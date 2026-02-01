import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SizeComparison: React.FC = () => {
    const navigate = useNavigate();
    const [targetType, setTargetType] = useState<'biggest' | 'smallest'>('biggest');
    const [options, setOptions] = useState<{ size: number, id: number }[]>([]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');

    const generateRound = () => {
        const type = Math.random() > 0.5 ? 'biggest' : 'smallest';
        setTargetType(type);
        const sizes = [40, 70, 110].sort(() => Math.random() - 0.5);
        setOptions(sizes.map((s, idx) => ({ size: s, id: idx })));
        setMessage(`Which one is the ${type}?`);
    };

    useEffect(() => {
        generateRound();
    }, []);

    const handleSelect = (size: number) => {
        const sortedSizes = options.map(o => o.size).sort((a, b) => a - b);
        const isCorrect = targetType === 'biggest'
            ? size === sortedSizes[sortedSizes.length - 1]
            : size === sortedSizes[0];

        if (isCorrect) {
            setScore(s => s + 1);
            setMessage('You got it! 🌟');
            setTimeout(generateRound, 1000);
        } else {
            setMessage('Try again! 😊');
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Size Matcher</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Matches: {score}
                </div>

                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4A90E2', marginBottom: '2rem' }}>{message}</p>

                <div className="display-area" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    minHeight: '200px'
                }}>
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => handleSelect(opt.size)}
                            style={{
                                width: `${opt.size}px`,
                                height: `${opt.size}px`,
                                background: '#FFD6A5',
                                borderRadius: '50%',
                                border: '4px solid white',
                                boxShadow: 'var(--clay-shadow)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: `${opt.size / 2}px`
                            }}
                        >
                            🐘
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SizeComparison;
