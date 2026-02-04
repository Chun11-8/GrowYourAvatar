import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const SizeComparison: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
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
