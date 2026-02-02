import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

const SizeComparison: React.FC = () => {
    const navigate = useNavigate();
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const [targetType, setTargetType] = useState<'biggest' | 'smallest'>('biggest');
    const [options, setOptions] = useState<{ size: number, id: number }[]>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');

    const generateRound = () => {
        const type = Math.random() > 0.5 ? 'biggest' : 'smallest';
        setTargetType(type);
        const sizes = [40, 70, 110].sort(() => Math.random() - 0.5);
        setOptions(sizes.map((s, idx) => ({ size: s, id: idx })));
        setMessage(`Which one is the ${type}?`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (size: number) => {
        const sortedSizes = options.map(o => o.size).sort((a, b) => a - b);
        const isCorrect = targetType === 'biggest'
            ? size === sortedSizes[sortedSizes.length - 1]
            : size === sortedSizes[0];

        if (isCorrect) {
            setMessage('You got it! 🌟');
            recordSuccess();
        } else {
            setMessage('Try again! 😊');
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
                        <button className="clay-button secondary" onClick={() => navigate('/game-hub')}>Back to Hub</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ marginRight: 'auto' }}>← Back</button>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Size Matcher</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

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
